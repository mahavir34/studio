import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpCircle, ArrowDownCircle, Gift, Copy } from 'lucide-react'
import Image from 'next/image'
import { investmentProducts } from '@/lib/data'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function DashboardPage() {
  const userBalance = 20000.00
  const referralCode = 'AICAS-H123XYZ'

  const getImage = (imageId: string) => {
    return PlaceHolderImages.find((img) => img.id === imageId)
  }

  return (
    <div className="space-y-6">
       <Card className="bg-card/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">My Balance</p>
                <p className="text-2xl font-bold">{userBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button asChild size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/bank">
                    <ArrowUpCircle className="mr-2 h-5 w-5" /> Recharge
                  </Link>
                </Button>
                 <Button asChild size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/bank">
                    <ArrowDownCircle className="mr-2 h-5 w-5" /> Withdraw
                  </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-yellow-500/20 border-yellow-500">
          <CardContent className="p-3 text-center">
            <Gift className="mx-auto mb-1 h-6 w-6 text-yellow-600" />
            <p className="text-sm font-semibold">Daily Rewards</p>
          </CardContent>
        </Card>
         <Card className="bg-red-500/20 border-red-500">
          <CardContent className="p-3 text-center">
            <Copy className="mx-auto mb-1 h-6 w-6 text-red-600" />
            <p className="text-sm font-semibold">Invite Friends</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Investment Products</h2>
        <div className="space-y-4">
          {investmentProducts.map((product) => {
            const image = getImage(product.imageId)
            return (
              <Card key={product.id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300 bg-card/80">
                 <div className="relative">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={product.name}
                      width={400}
                      height={150}
                      className="w-full h-36 object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  {product.limit && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      Limited
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold">₹{product.price}</p>
                    </div>
                     <div>
                      <p className="text-muted-foreground">Daily Return</p>
                      <p className="font-semibold">₹{product.dailyReturn}</p>
                    </div>
                     <div>
                      <p className="text-muted-foreground">Cycle</p>
                      <p className="font-semibold">{product.cycle} Days</p>
                    </div>
                     <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold text-chart-2">₹{product.totalReturn}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                   <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href={`/invest/${product.id}`}>Invest</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
