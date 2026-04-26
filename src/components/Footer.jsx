import { Link } from 'react-router-dom';
import { Briefcase, Globe, MessageSquare, Link as LinkIcon, Heart } from 'lucide-react';

const FOOTER_LINKS = {
  'For Job Seekers': [
    { label: 'Browse Jobs', to: '/jobs' },
    { label: 'Companies', to: '/companies' },
    { label: 'Career Advice', to: '#' },
    { label: 'Resume Builder', to: '#' },
  ],
  'For Employers': [
    { label: 'Post a Job', to: '/register?role=recruiter' },
    { label: 'Talent Search', to: '#' },
    { label: 'Recruiter Login', to: '/login' },
    { label: 'Pricing', to: '#' },
  ],
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Contact', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
  ],
};

const SOCIALS = [
  { icon: MessageSquare, href: '#', label: 'Twitter' },
  { icon: LinkIcon, href: '#', label: 'LinkedIn' },
  { icon: Globe, href: '#', label: 'GitHub' },
];

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-[var(--color-bg)] border-t border-[var(--color-border)] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                jobsearch
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              India's #1 job portal connecting millions of job seekers with top employers across industries.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} JobSearch. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
