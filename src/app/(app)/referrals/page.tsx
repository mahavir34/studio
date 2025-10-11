import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { referralLevels } from '@/lib/data'
import { Copy, Gift, Users } from 'lucide-react'

export default function ReferralsPage() {
  const referralCode = 'AICAS-H123XYZ'
  const totalRewards = 1570
  const totalTeamSize = 42

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">Invite friends and earn commissions from their investments.</p>
      </header>
      
      <section className="grid gap-6 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalRewards.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Earned from referrals</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalTeamSize}</div>
                <p className="text-xs text-muted-foreground">Total members in your team</p>
            </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>
              Share this code with your friends. When they sign up and invest, you'll earn a commission.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full p-3 bg-muted rounded-md font-mono text-lg tracking-widest text-center">
              {referralCode}
            </div>
            <Button className="w-full sm:w-auto">
              <Copy className="mr-2 h-4 w-4" /> Copy Code
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Commission Rates</CardTitle>
            <CardDescription>
              You'll earn a percentage of the investments made by users at different levels in your network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead className="text-right">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralLevels.map((level) => (
                  <TableRow key={level.level}>
                    <TableCell className="font-medium">Level {level.level}</TableCell>
                    <TableCell>
                      <span className="font-bold text-lg text-primary">{level.commission}%</span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {level.level === 1 ? "From your direct invites" : `From your Level ${level.level-1} invites`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
