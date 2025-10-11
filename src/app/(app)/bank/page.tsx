'use client';

import { useState, useActionState, useEffect } from 'react';
import { useUser } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createRazorpayOrder, verifyPayment } from '@/lib/razorpay-actions';
import { useFormStatus } from 'react-dom';

declare global {
    interface Window {
        Razorpay: any;
    }
}

type OrderState = {
  orderId: string | null;
  amount: number | null;
  error: string | null;
}

type VerificationState = {
    success: boolean;
    error: string | null;
}

const initialOrderState: OrderState = {
  orderId: null,
  amount: null,
  error: null,
};

const initialVerificationState: VerificationState = {
    success: false,
    error: null,
}

function SubmitButton({ amount }: { amount: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Proceed to Pay ₹{amount}
        </Button>
    )
}

export default function BankPage() {
  const { user } = useUser();
  const [amount, setAmount] = useState('1000');
  const [orderState, createOrderAction] = useActionState(createRazorpayOrder, initialOrderState);
  const [verificationState, verifyPaymentAction] = useActionState(verifyPayment, initialVerificationState);
  const { toast } = useToast();
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  const setPresetAmount = (preset: number) => {
    setAmount(String(preset));
  };

  const handleRazorpayPayment = (orderId: string, orderAmount: number) => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
     if (!key) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Razorpay Key ID is not set for the client.',
      });
      return;
    }
    const options = {
        key: key,
        amount: orderAmount * 100,
        currency: "INR",
        name: "AI Cash Gaming",
        description: "Recharge Transaction",
        order_id: orderId,
        handler: function (response: any) {
            const verificationData = new FormData();
            verificationData.append('razorpay_order_id', response.razorpay_order_id);
            verificationData.append('razorpay_payment_id', response.razorpay_payment_id);
            verificationData.append('razorpay_signature', response.razorpay_signature);
            verifyPaymentAction(verificationData);
        },
        prefill: {
            name: user?.displayName || "User",
            email: user?.email || "",
        },
        theme: {
            color: "#3399cc"
        }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
        toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: response.error.description,
        });
    });
    rzp1.open();
  }

  useEffect(() => {
    if (orderState.orderId && orderState.amount) {
      handleRazorpayPayment(orderState.orderId, orderState.amount);
    }
    if (orderState.error) {
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: orderState.error,
      });
    }
  }, [orderState]);

  useEffect(() => {
    if (verificationState.success) {
        toast({
            title: 'Payment Successful',
            description: `Your recharge has been processed.`,
        });
        // Here you would typically update the user's balance in Firestore
    }
    if(verificationState.error) {
        toast({
            variant: 'destructive',
            title: 'Payment Verification Failed',
            description: verificationState.error,
        });
    }
  }, [verificationState]);


  return (
    <div className="w-full">
      <Tabs defaultValue="recharge" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recharge">
            <ArrowUpCircle className="mr-2 h-5 w-5" /> Recharge
          </TabsTrigger>
          <TabsTrigger value="withdrawal">
            <ArrowDownCircle className="mr-2 h-5 w-5" /> Withdraw
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recharge">
            <Card>
              <CardHeader>
                <CardTitle>Recharge Account</CardTitle>
                <CardDescription>
                  Select an amount to add to your balance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={createOrderAction}>
                    <div className="space-y-2">
                      <Label htmlFor="recharge-amount">Amount (INR)</Label>
                      <Input
                        id="recharge-amount"
                        name="amount"
                        type="number"
                        placeholder="Enter amount in INR"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                    {user && <input type="hidden" name="userId" value={user.uid} />}
                    <div className="grid grid-cols-3 gap-2 my-4">
                      <Button type="button" variant="outline" onClick={() => setPresetAmount(500)}>₹500</Button>
                      <Button type="button" variant="outline" onClick={() => setPresetAmount(1000)}>₹1000</Button>
                      <Button type="button" variant="outline" onClick={() => setPresetAmount(2000)}>₹2000</Button>
                      <Button type="button" variant="outline" onClick={() => setPresetAmount(5000)}>₹5000</Button>
                      <Button type="button" variant="outline" onClick={() => setPresetAmount(10000)}>₹10000</Button>
                      <Button type="button" variant="outline" onClick={() => setPresetAmount(25000)}>₹25000</Button>
                    </div>
                    
                    <SubmitButton amount={amount} />
                </form>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  You will be redirected to your payment app to complete the payment.
                </p>
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="withdrawal">
            <Card>
                <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>Transfer your earnings to your bank account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="withdrawal-amount">Amount (INR)</Label>
                      <Input
                        id="withdrawal-amount"
                        type="number"
                        placeholder="Enter amount to withdraw"
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID / Bank Account</Label>
                      <Input
                        id="upi-id"
                        type="text"
                        placeholder="Enter your UPI or Bank details"
                      />
                    </div>
                    <Button className="w-full">Request Withdrawal</Button>
                     <p className="text-xs text-muted-foreground text-center">
                      Withdrawals are processed within 24 hours.
                    </p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
