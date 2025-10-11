'use server';

import Razorpay from 'razorpay';
import { z } from 'zod';
import crypto from 'crypto';

const amountSchema = z.string().transform(v => parseFloat(v)).pipe(z.number().positive());
const userIdSchema = z.string().min(1);

type CreateOrderState = {
  orderId: string | null;
  amount: number | null;
  error: string | null;
}

export async function createRazorpayOrder(
  prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const amountResult = amountSchema.safeParse(formData.get('amount'));
  const userIdResult = userIdSchema.safeParse(formData.get('userId'));
  
  if (!amountResult.success || !userIdResult.success) {
    return { orderId: null, amount: null, error: 'Invalid amount or user ID.' };
  }

  const amount = amountResult.data;
  
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
      let errorMessage = "Razorpay keys are not set in .env file. ";
      if (!keyId) errorMessage += "NEXT_PUBLIC_RAZORPAY_KEY_ID is missing. ";
      if (!keySecret) errorMessage += "RAZORPAY_KEY_SECRET is missing.";
      console.error(errorMessage);
      return { orderId: null, amount: null, error: 'Payment service is not configured.' };
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_user_${userIdResult.data}_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    if (!order) {
      return { orderId: null, amount: null, error: 'Could not create payment order.' };
    }
    return { orderId: order.id, amount: amount, error: null };
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return { orderId: null, amount: null, error: 'Could not create payment order. An unknown error occurred.' };
  }
}


const verificationSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

type VerificationState = {
    success: boolean;
    error: string | null;
}

export async function verifyPayment(prevState: VerificationState, formData: FormData): Promise<VerificationState> {
    const result = verificationSchema.safeParse({
        razorpay_order_id: formData.get('razorpay_order_id'),
        razorpay_payment_id: formData.get('razorpay_payment_id'),
        razorpay_signature: formData.get('razorpay_signature'),
    });

    if (!result.success) {
        return { success: false, error: 'Invalid verification data.' };
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_secret) {
        console.error('Razorpay key secret is not set.');
        return { success: false, error: 'Server configuration error.' };
    }

    try {
        const hmac = crypto.createHmac('sha256', key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is successful
            // Here you can save the payment details to your database
            return { success: true, error: null };
        } else {
            return { success: false, error: 'Signature mismatch.' };
        }
    } catch (error) {
        console.error('Payment verification failed:', error);
        return { success: false, error: 'An error occurred during verification.' };
    }
}
