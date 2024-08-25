import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M6 12h12" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
              <path d="M6 6c0 6 1.5 6 6 6s6 0 6-6" />
              <path d="M6 18c0-6 1.5-6 6-6s6 0 6 6" />
            </svg>
            <span className="text-sm font-semibold">RupayaBridge</span>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center space-x-4 text-sm">
              <li><Link href="/terms" className="hover:text-primary transition-colors duration-300">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors duration-300">Privacy</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors duration-300">Contact</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/rupaya-project" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://twitter.com/rupayacoin" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} RupayaBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}