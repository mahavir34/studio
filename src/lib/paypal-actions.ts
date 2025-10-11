'use server';

import { z } from 'zod';
import { doc, updateDoc, increment, getFirestore } from 'firebase/firestore/lite';
import { initializeFirebase } from '@/firebase/config';
import { getApp, getApps } from 'firebase/app';

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

// Schemas
const CreateOrderSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0.'),
  userId: z.string().min(1, 'User ID is required.'),
});

const CaptureOrderSchema = z.object({
  orderID: z.string(),
  userId: z.string(),
});

// Types
type CreateOrderState = {
  id?: string;
  error?: string;
};

type CaptureOrderState = {
  success?: boolean;
  error?: string;
};

// Helper Functions
function getDb() {
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeFirebase();
    return getFirestore(app);
}

async function getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_APP_SECRET;
    
    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials are not configured.');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error_description || 'Failed to get access token.');
    }
    return data.access_token;
}

// Server Actions
export async function createPayPalOrder(
  input: z.infer<typeof CreateOrderSchema>
): Promise<CreateOrderState> {
  const validatedFields = CreateOrderSchema.safeParse(input);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  const { amount, userId } = validatedFields.data;

  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        }],
      }),
    });

    const order = await response.json();
    if (!response.ok) {
        throw new Error(order.message || 'Failed to create order.');
    }

    return { id: order.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Could not create PayPal order. ${errorMessage}` };
  }
}

export async function capturePayPalOrder(
  input: z.infer<typeof CaptureOrderSchema>
): Promise<CaptureOrderState> {
    const validatedFields = CaptureOrderSchema.safeParse(input);

    if (!validatedFields.success) {
      return { error: 'Invalid payment capture data.' };
    }

    const { orderID, userId } = validatedFields.data;
    
    let capturedAmount = 0;

    try {
        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const capturedData = await response.json();

        if (capturedData.status !== 'COMPLETED') {
            return { error: 'Payment not completed successfully.' };
        }
        
        capturedAmount = parseFloat(capturedData.purchase_units[0].payments.captures[0].amount.value);
        
    } catch(error) {
        console.error('Failed to capture payment:', error);
        return { error: 'Failed to verify payment with PayPal.' };
    }

    try {
        const firestore = getDb();
        const userRef = doc(firestore, 'users', userId);

        await updateDoc(userRef, {
            balance: increment(capturedAmount)
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to update balance:', error);
        return { error: 'Payment captured but failed to update balance.' };
    }
}
