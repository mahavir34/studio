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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Bank</CardTitle>
          <CardDescription>
            Manage your funds. Recharge your account or withdraw your earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="recharge-amount">Amount</Label>
                  <Input
                    id="recharge-amount"
                    type="number"
                    placeholder="Enter amount to recharge"
                  />
                </div>
                <Button className="w-full">Proceed to Recharge</Button>
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to our secure payment partner.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="withdrawal">
              <div className="space-y-4 pt-4">
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
