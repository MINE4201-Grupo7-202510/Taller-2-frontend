"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const routes = [
    { href: "/", label: "Inicio", public: true },
    { href: "/dashboard", label: "Dashboard", public: false },
    { href: "/profile", label: "Perfil", public: false },
    { href: "/experiments", label: "Experimentos", public: true },
  ]

  const filteredRoutes = routes.filter((route) => route.public || user)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Recomendador de Yelp</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-4">
            {filteredRoutes.map((route) => (
              <Button key={route.href} asChild variant={pathname === route.href ? "default" : "ghost"} size="sm">
                <Link href={route.href}>{route.label}</Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <DarkModeToggle />

            {!user && pathname !== "/login" && (
              <Button asChild size="sm" className="hidden md:flex">
                <Link href="/login">Ingresar</Link>
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <span className="font-bold text-xl">YelpRec</span>
                  </Link>
                  <nav className="flex flex-col space-y-3">
                    {filteredRoutes.map((route) => (
                      <Button
                        key={route.href}
                        asChild
                        variant={pathname === route.href ? "default" : "ghost"}
                        size="sm"
                        className="justify-start"
                      >
                        <Link href={route.href}>{route.label}</Link>
                      </Button>
                    ))}

                    {!user && pathname !== "/login" && (
                      <Button asChild size="sm" className="justify-start">
                        <Link href="/login">Ingresar</Link>
                      </Button>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
