'use server';

import { z } from 'zod';
import Razorpay from 'razorpay';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore/lite';
import { initializeFirebase } from '@/firebase';

const CreateOrderSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1.'),
  userId: z.string().min(1, 'User ID is required.'),
});

type CreateOrderState = {
  orderId?: string;
  error?: string;
};

export async function createRazorpayOrder(
  prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const validatedFields = CreateOrderSchema.safeParse({
    amount: Number(formData.get('amount')),
    userId: formData.get('userId') as string,
  });

  if (!validatedFields.success) {
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
    return { error: 'Could not create payment order. Please try again.' };
  }
}

const VerifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
  userId: z.string(),
  amount: z.number(),
});

type VerifyPaymentState = {
  success?: boolean;
  error?: string;
};

// This function is illustrative. A real verification must be done on server.
// For security, true signature verification requires crypto which is best done in a serverless function.
export async function verifyPaymentAndUpdateBalance(
  paymentData: z.infer<typeof VerifyPaymentSchema>
): Promise<VerifyPaymentState> {
    const { userId, amount } = paymentData;

    try {
        const { firestore } = initializeFirebase();
        const userRef = doc(firestore, 'users', userId);

        // Here you would add the transaction to a 'transactions' subcollection
        // For simplicity, we are just updating the balance.
        await updateDoc(userRef, {
            balance: increment(amount)
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to update balance:', error);
        return { error: 'Failed to update balance after payment.' };
    }
}
