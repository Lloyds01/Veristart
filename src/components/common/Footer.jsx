import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

const LINKS = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Pitch Generator', href: '/dashboard/pitch' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  'For Investors': [
    { label: 'Deal Flow', href: '/investor/dashboard' },
    { label: 'Investor Pricing', href: '/pricing#investors' },
    { label: 'Portfolio Tools', href: '/investor/portfolio' },
    { label: 'Partner With Us', href: '/partners' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-gold-500/20">
      <div className="container-max px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/veristart-logo.svg" alt="Veristart" className="w-7 h-7" />
              <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Verify your startup.<br />Attract the right capital.
            </p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:bg-navy-700 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-slate-400 text-sm hover:text-gold-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Veristart. All rights reserved.</p>
          <p className="text-slate-600 text-xs">Built for African founders 🌍</p>
        </div>
      </div>
    </footer>
  )
}
