import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { Inter, Orbitron, Rajdhani } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-orbitron',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-rajdhani',
});

const BASE_URL = 'https://www.zedithx.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Yang Si Jun | Software Developer Portfolio',
    template: '%s | Yang Si Jun',
  },
  description:
    'Interactive macOS-themed portfolio of Yang Si Jun — software developer specializing in full-stack development, DevOps, and cloud infrastructure. Explore projects, skills, and experience through a unique terminal interface.',
  keywords: [
    'Yang Si Jun',
    'zedithx',
    'software developer',
    'full-stack developer',
    'portfolio',
    'DevOps',
    'cloud infrastructure',
    'React',
    'Next.js',
    'Java',
    'Firebase',
  ],
  authors: [{ name: 'Yang Si Jun', url: BASE_URL }],
  creator: 'Yang Si Jun',
  publisher: 'Yang Si Jun',
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Yang Si Jun — Portfolio',
    title: 'Yang Si Jun | Software Developer Portfolio',
    description:
      'Interactive macOS-themed developer portfolio. Explore projects, skills, and experience through a unique desktop & terminal interface.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yang Si Jun — Software Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yang Si Jun | Software Developer Portfolio',
    description:
      'Interactive macOS-themed developer portfolio with a terminal interface.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yang Si Jun',
    url: BASE_URL,
    sameAs: [
      'https://github.com/zedithx',
      'https://www.linkedin.com/in/yangsijun',
    ],
    jobTitle: 'Software Developer',
    knowsAbout: [
      'Full-Stack Development',
      'DevOps',
      'Cloud Infrastructure',
      'React',
      'Next.js',
      'Java',
      'Firebase',
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen fixed inset-0 overflow-hidden w-full">
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
