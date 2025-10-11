"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Trophy, User } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/referrals", label: "Referrals", icon: Users },
  { href: "/tasks", label: "Tasks", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-around items-center p-2 bg-card">
      {links.map((link) => (
        <Link href={link.href} key={link.href} className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-1/4",
          pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
        )}>
            <link.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{link.label}</span>
        </Link>
      ))}
    </nav>
  )
}
