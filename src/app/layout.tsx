import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { CartProvider } from '@/context/cart-context';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});



export const metadata: Metadata = {
  title: 'Momcakespe | Tortas de Boda y XV Años Premium',
  description: 'Momcakespe: El centro de atención de tu celebración. Pastelería fina de autor, diseño exclusivo y sabores gourmet para bodas, quinceañeros y eventos exclusivos.',
  icons: {
    icon: '/img/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(
        "min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary selection:text-white",
        outfit.variable,
        playfair.variable
      )}>
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors duration={2000} />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
