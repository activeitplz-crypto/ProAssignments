import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { PurchaseNotification } from '@/components/purchase-notification';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProAssignment',
  description: 'Manage your investment plans with ease. Earn daily by completing tasks.',
  keywords: ['ProAssignment', 'online earning', 'daily tasks', 'investment plans', 'earning app', 'pakistan earning', 'assignment work', 'earning by assignment', 'assignment', 'assignment writing'],
  icons: {
    icon: 'https://i.postimg.cc/4NycZngc/In-Shot-20250828-122821151.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "191e2e31-9ca4-48b9-9086-a1582ec6b8b9",
              });
            });
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <PurchaseNotification />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
