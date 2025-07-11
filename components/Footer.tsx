import type React from "react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Link href="/">
            <Image src="/logo.png" alt="House of TMM Logo" width={150} height={50} className="h-12 w-auto mb-4" />
          </Link>
          <p className="text-sm leading-relaxed">
            House of TMM is your premier destination for the latest in fashion, lifestyle, and culture. We bring you
            exclusive content, interviews, and trends from India and around the globe.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/fashion" className="hover:text-white transition-colors">
                Fashion
              </Link>
            </li>
            <li>
              <Link href="/lifestyle" className="hover:text-white transition-colors">
                Lifestyle
              </Link>
            </li>
            <li>
              <Link href="/sports" className="hover:text-white transition-colors">
                Sports
              </Link>
            </li>
            <li>
              <Link href="/interviews" className="hover:text-white transition-colors">
                Interviews
              </Link>
            </li>
            <li>
              <Link href="/trending" className="hover:text-white transition-colors">
                Trending
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-sm">123 Fashion Street, Mumbai, India</p>
          <p className="text-sm mt-2">Email: info@houseoftmm.com</p>
          <p className="text-sm mt-2">Phone: +91 12345 67890</p>
          <div className="flex space-x-4 mt-4">
            <Link href="#" aria-label="Facebook">
              <FacebookIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <TwitterIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <InstagramIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <LinkedinIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} House of TMM. All rights reserved.
      </div>
    </footer>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17-18 11.6 2.2.1 4.4-.6 6-2 1.1 0 2.1-.3 2.9-.8 3.3 1.4 5.6-2.8 4.4-5.3 1.1-.9 2.2-2.4 2.4-4.9-.2-.2-.4-.3-.6-.4z" />
    </svg>
  )
}
