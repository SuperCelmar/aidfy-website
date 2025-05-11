import Link from 'next/link'
import Image from 'next/image'

// A simple ChevronDownIcon component
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block ml-1">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md py-4">
      <div className="container mx-auto px-10 max-w-7xl flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/assets/logo.png" 
            alt="AutomationDFY Logo"
            width={160}
            height={40}
            className="h-10 md:h-12 w-auto"
          />
          <span className="text-2xl font-bold text-slate-700 self-center">
            AutomationDFY
          </span>
        </Link>
        <nav className="space-x-6 flex items-center">
          <Link href="/#features" className="text-gray-600 hover:text-slate-700">
            Features
          </Link>
          <Link href="/#use-cases" className="text-gray-600 hover:text-slate-700">
            Use Cases
          </Link>
        </nav>
        <div className="space-x-2">
          <Link
            href="/book-demo"
            className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </header>
  )
} 