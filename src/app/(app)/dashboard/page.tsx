import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpCircle, ArrowDownCircle, Gift } from 'lucide-react'
import Image from 'next/image'
import { investmentProducts } from '@/lib/data'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const userBalance = 20000.00

  const getImage = (imageId: string) => {
    return PlaceHolderImages.find((img) => img.id === imageId)
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-2 bg-card/50">
            <CardHeader>
              <CardTitle>Earnings & Withdrawals</CardTitle>
              <CardDescription>Your current balance is ${userBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  <ArrowUpCircle className="mr-2 h-5 w-5" /> Recharge
                </Button>
                 <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <ArrowDownCircle className="mr-2 h-5 w-5" /> Withdraw
                </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-purple-600 text-accent-foreground flex flex-col justify-between">
             <CardHeader>
               <CardTitle>Daily Reward</CardTitle>
               <CardDescription className="text-purple-200">Invite Friends, Earn Bonuses!</CardDescription>
             </CardHeader>
             <CardContent>
                <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white w-full">
                  <Gift className="mr-2 h-5 w-5" /> Claim Now
                </Button>
             </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Investment Opportunities</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {investmentProducts.map((product) => {
            const image = getImage(product.imageId)
            return (
              <Card key={product.id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300 bg-card/50">
                <div className="relative">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={product.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  {product.limit && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      Limited
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Invest</p>
                      <p className="font-semibold">₹{product.price}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Daily</p>
                      <p className="font-semibold">₹{product.dailyReturn}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Cycle</p>
                      <p className="font-semibold">{product.cycle} Days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Total Return</p>
                      <p className="font-semibold text-chart-2">₹{product.totalReturn}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Invest Now</Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
