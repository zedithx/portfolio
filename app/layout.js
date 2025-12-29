import './globals.css';

export const metadata = {
  title: 'zedithx',
  description: 'A portfolio website mimicking macOS desktop with a terminal interface.',
  icons: {
    icon: '/favicon/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen fixed inset-0 overflow-hidden w-full">
        <style dangerouslySetInnerHTML={{ __html: `
          * {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              box-sizing: border-box;
          }
          
          html, body {
              position: fixed;
              overflow: hidden;
              width: 100%;
              height: 100%;
              -webkit-overflow-scrolling: touch;
              overscroll-behavior: none;
          }
          
          body > * {
              max-width: 100vw;
              overflow-x: hidden;
          }
          
          ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
          }
          
          ::-webkit-scrollbar-track {
              background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
          }

          ::selection {
              background: rgba(99, 102, 241, 0.3);
          }
        `}} />
        {children}
      </body>
    </html>
  );
}


