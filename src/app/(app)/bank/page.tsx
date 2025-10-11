'use client';

import { useState } from 'react';
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

export default function BankPage() {
  const { user } = useUser();
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    // Placeholder for actual payment gateway integration
    toast({ title: 'Processing Recharge...', description: `Requesting to add ₹${numAmount}` });
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, you would get a response from the payment gateway
        // and then update the user's balance in Firestore.
        toast({ title: 'Recharge Successful!', description: `₹${numAmount} has been added to your account.`});
        setLoading(false);
    }, 2000);
  };


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
                
                <Button onClick={handleRecharge} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Proceed to Pay ₹{amount}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to your payment app (PhonePe, GPay, etc.) to complete the payment.
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
