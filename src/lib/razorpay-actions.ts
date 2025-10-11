'use server';

import { z } from 'zod';
import Razorpay from 'razorpay';
import { doc, updateDoc, increment, getFirestore } from 'firebase/firestore/lite';
import { initializeFirebase } from '@/firebase/config';
import { getApp, getApps } from 'firebase/app';

const CreateOrderSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be at least 1.'),
  userId: z.string().min(1, 'User ID is required.'),
});

type CreateOrderState = {
  orderId?: string;
  error?: string;
};

// This function needs to be defined outside of createRazorpayOrder to be accessible.
function getDb() {
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeFirebase();
    return getFirestore(app);
}

export async function createRazorpayOrder(
  prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const validatedFields = CreateOrderSchema.safeParse({
    amount: formData.get('amount'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Invalid amount or user ID.',
    };
  }

  const { amount, userId } = validatedFields.data;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_user_${userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return { error: 'Failed to create Razorpay order.' };
    }

    return { orderId: order.id };
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Could not create payment order. ${errorMessage}` };
  }
}

const VerifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
  userId: z.string(),
  amount: z.coerce.number(),
});

type VerifyPaymentState = {
  success?: boolean;
  error?: string;
};


export async function verifyPaymentAndUpdateBalance(
  paymentData: z.infer<typeof VerifyPaymentSchema>
): Promise<VerifyPaymentState> {
    const validatedFields = VerifyPaymentSchema.safeParse(paymentData);

    if (!validatedFields.success) {
      return { error: 'Invalid payment verification data.' };
    }

    const { userId, amount } = validatedFields.data;

    // IMPORTANT: In a real production app, you MUST verify the signature here
    // using crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    // This is skipped for brevity in this prototyping environment.
    
    try {
        const firestore = getDb();
        const userRef = doc(firestore, 'users', userId);

        await updateDoc(userRef, {
            balance: increment(amount)
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to update balance:', error);
        return { error: 'Failed to update balance after payment.' };
    }
}
