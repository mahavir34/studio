import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Settings,
  Wallet,
  Globe,
} from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { Chatbot } from '@/components/chatbot';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const userBalance = 20000.00;
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold">AI CASH GAMING</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg">
             {userBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </div>
          <Button variant="outline" size="sm">
            English
            <Globe className="ml-2 h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" data-ai-hint="profile picture" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      <Chatbot />
      <footer className="sticky bottom-0 md:hidden bg-card border-t">
        <MainNav />
      </footer>
    </div>
  );
}
