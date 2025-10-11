'use client';

import { useParams } from 'next/navigation';
import { investmentProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function InvestProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { productId } = params;

  const product = investmentProducts.find((p) => p.id === productId);
  const image = PlaceHolderImages.find((img) => img.id === product?.imageId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">
          The investment product you are looking for does not exist.
        </p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard">Go back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const handleInvestment = () => {
    // This is a placeholder for the actual investment logic.
    // In a real app, this would involve checking user balance,
    // creating a transaction record in Firestore, etc.
    toast({
      title: 'Investment Successful!',
      description: `You have successfully invested in ${product.name}.`,
    });
    // Redirect back to dashboard after "investment"
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
       <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Invest</h1>
      </header>

      <Card key={product.id} className="overflow-hidden flex flex-col">
        <div className="relative">
          {image && (
            <Image
              src={image.imageUrl}
              alt={product.name}
              width={400}
              height={150}
              className="w-full h-48 object-cover"
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
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Investment Amount</span>
              <span className="font-bold text-lg">
                {product.price.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Daily Income</span>
              <span className="font-bold text-lg text-green-500">
                +{' '}
                {product.dailyReturn.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Investment Cycle</span>
              <span className="font-bold text-lg">{product.cycle} Days</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Total Revenue</span>
              <span className="font-bold text-lg text-chart-2">
                {product.totalReturn.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <Button
            className="w-full"
            size="lg"
            onClick={handleInvestment}
          >
            Confirm Investment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
