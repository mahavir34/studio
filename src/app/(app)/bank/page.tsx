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

declare global {
    interface Window {
        Razorpay: any;
    }
}

type OrderState = {
  orderId: string | null;
  error: string | null;
}

const initialState: OrderState = {
  orderId: null,
  error: null,
};

export default function BankPage() {
  const { user } = useUser();
  const [amount, setAmount] = useState('1000');
  const [orderState, createOrderAction] = useActionState(createRazorpayOrder, initialState);
  const { toast } = useToast();
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  const setPresetAmount = (preset: number) => {
    setAmount(String(preset));
  };

  const handleRecharge = () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to recharge.' });
        return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount.' });
        return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('userId', user.uid);
    createOrderAction(formData);
  };

  const handleRazorpayPayment = async (orderId: string) => {
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(amount) * 100, // amount in the smallest currency unit
        currency: "INR",
        name: "AI Cash Gaming",
        description: "Recharge Transaction",
        order_id: orderId,
        handler: async function (response: any) {
            const verificationData = new FormData();
            verificationData.append('razorpay_order_id', response.razorpay_order_id);
            verificationData.append('razorpay_payment_id', response.razorpay_payment_id);
            verificationData.append('razorpay_signature', response.razorpay_signature);
            
            const verificationResult = await verifyPayment(verificationData);

            if (verificationResult.success) {
                toast({
                    title: 'Payment Successful',
                    description: `₹${amount} has been added to your account.`,
                });
                // Here you would typically update the user's balance in Firestore
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Payment Verification Failed',
                    description: verificationResult.error || 'An unknown error occurred.',
                });
            }
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
    if (orderState.orderId) {
      handleRazorpayPayment(orderState.orderId);
    }
    if (orderState.error) {
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: orderState.error,
      });
    }
  }, [orderState]);

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
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(500)}>₹500</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(1000)}>₹1000</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(2000)}>₹2000</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(5000)}>₹5000</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(10000)}>₹10000</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(25000)}>₹25000</Button>
                </div>
                
                <Button onClick={handleRecharge} className="w-full">
                  Proceed to Pay ₹{amount}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
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
