'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, User as UserIcon } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = getAuth();


  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Please log in to view your profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user-profile/80/80"} data-ai-hint="profile picture" />
            <AvatarFallback className="text-3xl">
              {user.email?.charAt(0).toUpperCase() || <UserIcon />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.displayName || 'Welcome User'}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user.email || ''} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username (Display Name)</Label>
            <Input id="username" type="text" placeholder="Set your display name" defaultValue={user.displayName || ''} />
          </div>
           <Button>Update Profile</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline">Change Password</Button>
             <Separator />
             <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
        </CardContent>
      </Card>

    </div>
  );
}
