'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
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
import { createRazorpayOrder, verifyPaymentAndUpdateBalance } from '@/lib/razorpay-actions';

declare global {
    interface Window { Razorpay: any; }
}

const initialOrderState = {
  orderId: undefined,
  error: undefined,
};


export default function BankPage() {
  const { user, isUserLoading } = useUser();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [createOrderState, createOrderAction, isCreateOrderPending] = useActionState(createRazorpayOrder, initialOrderState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createOrderState.error) {
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: createOrderState.error,
      });
      setLoading(false);
    }
    if (createOrderState.orderId) {
        handleRazorpayPayment(createOrderState.orderId);
    }
  }, [createOrderState]);


  const handleFormAction = (formData: FormData) => {
     if (!user) {
        toast({ variant: 'destructive', title: 'Please log in first.' });
        return;
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount.' });
        return;
    }
    setLoading(true);
    formData.append('amount', amount);
    formData.append('userId', user.uid);
    createOrderAction(formData);
  }

  const handleRazorpayPayment = async (orderId: string) => {
     if (!user) return;

     const numAmount = Number(amount);

     const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: numAmount * 100,
        currency: "INR",
        name: "AI Cash Gaming",
        description: "Recharge your wallet",
        image: "https://storage.googleapis.com/project-spark-341015.appspot.com/a58f4a76-1b8e-4a87-a3d2-4e9638c11e73", //Your Logo URL
        order_id: orderId,
        handler: async function (response: any) {
            toast({ title: 'Processing Payment...' });
            const result = await verifyPaymentAndUpdateBalance({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.uid,
                amount: numAmount,
            });

            if (result.success) {
                toast({ title: 'Success', description: 'Your balance has been updated.' });
            } else {
                toast({ variant: 'destructive', title: 'Verification Failed', description: result.error });
            }
            setLoading(false);
            formRef.current?.reset();
            setAmount('');
        },
        prefill: {
            name: user.displayName || "New User",
            email: user.email,
        },
        theme: {
            color: "#3399cc"
        },
        modal: {
            ondismiss: function() {
                setLoading(false);
                toast({ variant: 'destructive', title: 'Payment cancelled.' });
            }
        }
    };
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Razorpay Key ID is not configured. Please contact support.',
      });
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const setPresetAmount = (preset: number) => {
    setAmount(String(preset));
  }
  
  const isPending = isCreateOrderPending || loading;

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
            <form ref={formRef} action={handleFormAction}>
              <Card>
                <CardHeader>
                  <CardTitle>Recharge Account</CardTitle>
                  <CardDescription>
                    Select an amount to add to your balance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recharge-amount">Amount</Label>
                    <Input
                      id="recharge-amount"
                      name="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button type="button" variant="outline" onClick={() => setPresetAmount(500)} disabled={isPending}>₹500</Button>
                    <Button type="button" variant="outline" onClick={() => setPresetAmount(1000)} disabled={isPending}>₹1000</Button>
                    <Button type="button" variant="outline" onClick={() => setPresetAmount(2000)} disabled={isPending}>₹2000</Button>
                    <Button type="button" variant="outline" onClick={() => setPresetAmount(5000)} disabled={isPending}>₹5000</Button>
                    <Button type="button" variant="outline" onClick={() => setPresetAmount(10000)} disabled={isPending}>₹10000</Button>
                    <Button type="button" variant="outline" onClick={() => setPresetAmount(25000)} disabled={isPending}>₹25000</Button>
                  </div>
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>) : 'Proceed to Recharge'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You will be redirected to our secure payment partner.
                  </p>
                </CardContent>
              </Card>
            </form>
        </TabsContent>
        <TabsContent value="withdrawal">
            <Card>
                <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>Transfer your earnings to your bank account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="withdrawal-amount">Amount</Label>
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
