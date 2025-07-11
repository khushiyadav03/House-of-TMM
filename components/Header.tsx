import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b">
      <Link className="flex items-center gap-2" href="/">
        <Image src="/placeholder.svg?height=40&width=120" alt="TMM India Logo" width={120} height={40} />
      </Link>
      <nav className="hidden md:flex gap-4 lg:gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
              Cover
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link href="/cover/digital-cover">Digital Cover</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/cover/editorial-shoot">Editorial Shoot</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
              Brand Feature
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link href="/BrandFeature/fashion">Fashion</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/BrandFeature/tech-auto">Tech & Auto</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
              Lifestyle
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link href="/Lifestyle/food-drinks">Food & Drinks</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Lifestyle/health-wellness">Health & Wellness</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Lifestyle/fitness-selfcare">Fitness & Selfcare</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Lifestyle/travel">Travel</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Lifestyle/finance">Finance</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
              Sports
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link href="/sports/cricket">Cricket</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/sports/golf">Golf</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/sports/other-sports">Other Sports</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link className="text-sm font-medium transition-colors hover:text-primary" href="/interviews">
          Interviews
        </Link>
        <Link className="text-sm font-medium transition-colors hover:text-primary" href="/trending">
          Trending
        </Link>
        <Link className="text-sm font-medium transition-colors hover:text-primary" href="/magazine">
          Magazine
        </Link>
      </nav>
      <Button className="md:hidden bg-transparent" size="icon" variant="outline">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </header>
  )
}
