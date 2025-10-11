import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

export default function BankPage() {
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
                    <CardDescription>Select an amount to add to your balance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recharge-amount">Amount</Label>
                      <Input
                        id="recharge-amount"
                        type="number"
                        placeholder="Enter amount"
                      />
                    </div>
                     <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline">₹500</Button>
                        <Button variant="outline">₹1000</Button>
                        <Button variant="outline">₹2000</Button>
                        <Button variant="outline">₹5000</Button>
                        <Button variant="outline">₹10000</Button>
                        <Button variant="outline">₹25000</Button>
                    </div>
                    <Button className="w-full">Proceed to Recharge</Button>
                    <p className="text-xs text-muted-foreground text-center">
                      You will be redirected to our secure payment partner.
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
  )
}
