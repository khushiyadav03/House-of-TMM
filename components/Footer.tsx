"use client"

import { FaFacebookF, FaInstagram, FaYoutube, FaPinterest, FaLinkedin } from "react-icons/fa"
import { X } from "lucide-react"
import Link from "next/link"

const socialMediaLinks = [
  { name: "Instagram", href: "https://www.instagram.com/tmmindia/?hl=en", icon: FaInstagram },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61576672324702", icon: FaFacebookF },
  { name: "YouTube", href: "https://www.youtube.com/@TMMIndiaOfficial", icon: FaYoutube },
  { name: "Twitter", href: "https://x.com/tmmindiaa", icon: X },
  { name: "Pinterest", href: "https://in.pinterest.com/tmmindiaofficial", icon: FaPinterest },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/tmm-india", icon: FaLinkedin },
]

const navItems = [
  { name: "FASHION", href: "/BrandFeature/fashion" },
  { name: "SPORTS", href: "/sports" },
  { name: "TRAVEL", href: "/Lifestyle/travel" },
  { name: "COVER", href: "/cover" },
  { name: "MEDIA KIT", href: "/TMM Media Kit 2025.pdf", download: true },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white" style={{ height: "266px" }}>
      <div className="container mx-auto h-full flex flex-col items-center justify-center py-6">
        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          {socialMediaLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label={link.name}
            >
              <link.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Nav Links */}
        <ul className="flex justify-center space-x-4 mb-6">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.download ? (
                <a
                  href={item.href}
                  className="uppercase hover:text-gray-300 font-bold"
                  download="TMM Media Kit 2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              ) : (
                <Link href={item.href} className="uppercase hover:text-gray-300 font-bold">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-sm">© 2025 TMM India</p>
      </div>
    </footer>
  )
}
