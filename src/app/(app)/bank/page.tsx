'use client';

import { useState, useEffect, useRef } from 'react';
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
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal-actions';

declare global {
    interface Window { paypal: any; }
}

export default function BankPage() {
  const { user } = useUser();
  const [amount, setAmount] = useState('10.00'); // Default amount for PayPal
  const [loading, setLoading] = useState(false);
  const paypalButtonContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  useEffect(() => {
    if (window.paypal && paypalButtonContainer.current && user) {
        // To avoid re-rendering the button unnecessarily, clear the container first
        if (paypalButtonContainer.current) {
            paypalButtonContainer.current.innerHTML = '';
        }

        setLoading(true);
        window.paypal.Buttons({
            createOrder: async (data: any, actions: any) => {
                const numAmount = parseFloat(amount);
                if (isNaN(numAmount) || numAmount <= 0) {
                    toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount.' });
                    return;
                }
                const order = await createPayPalOrder({ amount: numAmount, userId: user.uid });
                if (order.id) {
                    return order.id;
                } else {
                    toast({ variant: 'destructive', title: 'Order Error', description: order.error || 'Could not create PayPal order.' });
                    return;
                }
            },
            onApprove: async (data: any, actions: any) => {
                setLoading(true);
                toast({ title: 'Processing Payment...' });
                const result = await capturePayPalOrder({ orderID: data.orderID, userId: user.uid });
                if (result.success) {
                    toast({ title: 'Success', description: 'Your balance has been updated.' });
                } else {
                    toast({ variant: 'destructive', title: 'Payment Failed', description: result.error || 'Could not capture payment.' });
                }
                setLoading(false);
            },
            onError: (err: any) => {
                toast({ variant: 'destructive', title: 'Payment Error', description: `An error occurred: ${err}` });
                setLoading(false);
            },
            onCancel: () => {
                toast({ variant: 'destructive', title: 'Payment Cancelled' });
                setLoading(false);
            }
        }).render(paypalButtonContainer.current).then(() => {
            setLoading(false);
        }).catch((err: any) => {
            console.error("Failed to render PayPal buttons", err);
            setLoading(false);
        });
    }
  }, [amount, user, toast]);


  const setPresetAmount = (preset: number) => {
    setAmount(String(preset));
  }

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
                  Select an amount to add to your balance using PayPal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recharge-amount">Amount (USD)</Label>
                  <Input
                    id="recharge-amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount in USD"
                    value={amount}
                    onChange={handleAmountChange}
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(10)} disabled={loading}>$10</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(20)} disabled={loading}>$20</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(50)} disabled={loading}>$50</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(100)} disabled={loading}>$100</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(200)} disabled={loading}>$200</Button>
                  <Button type="button" variant="outline" onClick={() => setPresetAmount(500)} disabled={loading}>$500</Button>
                </div>
                {loading && (
                    <div className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span>Loading PayPal...</span>
                    </div>
                )}
                <div ref={paypalButtonContainer} className="w-full min-h-[50px] relative z-0"></div>
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to PayPal to complete your payment.
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
