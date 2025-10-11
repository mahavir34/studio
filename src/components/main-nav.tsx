"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, CircleDollarSign, Gift, User, Trophy, Users } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/invest", label: "Invest", icon: CircleDollarSign },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
]

const desktopLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/referrals", label: "Referrals", icon: Users },
  { href: "/tasks", label: "Tasks", icon: Trophy },
]


export function MainNav() {
  const pathname = usePathname()

  return (
    <>
    {/* Mobile Nav */}
    <div className="md:hidden flex justify-around items-center p-2">
      {links.map((link) => (
        <Link href={link.href} key={link.href} className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}>
            <link.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{link.label}</span>
        </Link>
      ))}
    </div>
    {/* Desktop Nav */}
    <div className="hidden md:flex flex-col gap-2 p-4">
      {desktopLinks.map((link) => (
         <Link href={link.href} key={link.href} className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-lg",
          pathname.startsWith(link.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}>
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
        </Link>
      ))}
    </div>
    </>
  )
}
