import Link from 'next/link';
import Image from 'next/image';

// Placeholder icons (replace with actual icons later if needed)
const PlaceholderSocialIcon = ({ name }: { name: string }) => (
  <span className="text-xs">{name}</span>
);

export default function Footer() {
  return (
    <footer className="bg-slate-700 text-slate-300 py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
          {/* Column 1: Brand and Slogan */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets//logo.png" // Assuming the logo is suitable for a dark background
                alt="AutomationDFY Logo"
                width={128} // Slightly smaller for footer
                height={32}
                className="h-8 w-auto filter brightness-0 invert"
              />
              {/* <span className="text-xl font-bold text-white self-center">
                AutomationDFY
              </span> */}
            </Link>
            <p className="text-sm text-slate-400">
              Unlocking new channels with AI marketing solutions.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="font-semibold text-white mb-3">Navigate</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#use-cases" className="hover:text-white transition-colors">Use Cases</Link></li>
              <li><Link href="/book-demo" className="hover:text-white transition-colors">Book a Demo</Link></li>
              {/* Add more links as needed, e.g., Blog, About Us */}
            </ul>
          </div>

          {/* Column 3: Contact & Social */}
          <div>
            <h5 className="font-semibold text-white mb-3">Connect</h5>
            <ul className="space-y-2 text-sm mb-4">
              <li><a href="mailto:marcel.lin@automationdfy.com" className="hover:text-white transition-colors">contact@automationdfy.com</a></li>
              {/* Add phone number or other contact if desired */}
            </ul>
            {/* Social Icons 
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="hover:text-white transition-colors"><PlaceholderSocialIcon name="FB" /></Link>
              <Link href="#" aria-label="Twitter" className="hover:text-white transition-colors"><PlaceholderSocialIcon name="TW" /></Link>
              <Link href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><PlaceholderSocialIcon name="LI" /></Link>
            </div>
            */}
          </div>
        </div>

        <div className="border-t border-slate-600 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AutomationDFY. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/terms-and-conditions" className="text-slate-400 hover:text-white transition-colors underline">
              Terms & Conditions
            </Link>
            <span className="mx-2 text-slate-500">|</span>
            <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 