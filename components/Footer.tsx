import Link from "next/link"
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"
import { X } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">About TMM India</h3>
          <p className="text-gray-400 text-sm">
            TMM India is a leading digital magazine bringing you the latest in fashion, lifestyle, sports, and more.
            Stay updated with our exclusive interviews, trending topics, and in-depth articles.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/magazine" className="text-gray-400 hover:text-white transition-colors">
                Magazine
              </Link>
            </li>
            <li>
              <Link href="/articles" className="text-gray-400 hover:text-white transition-colors">
                Articles
              </Link>
            </li>
            <li>
              <Link href="/interviews" className="text-gray-400 hover:text-white transition-colors">
                Interviews
              </Link>
            </li>
            <li>
              <Link href="/trending" className="text-gray-400 hover:text-white transition-colors">
                Trending
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.facebook.com/profile.php?id=61576672324702"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://www.instagram.com/tmmindia/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://x.com/tmmindiaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <X size={24} />
            </a>
            <a
              href="https://www.youtube.com/@TMMIndiaOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube size={24} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">Email: info@tmmindia.com</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TMM India. All rights reserved.
      </div>
    </footer>
  )
}
