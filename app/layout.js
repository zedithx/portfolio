import './globals.css';

export const metadata = {
  title: 'Portfolio - MacOS Desktop',
  description: 'A portfolio website mimicking macOS desktop with a terminal interface.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <style dangerouslySetInnerHTML={{ __html: `
          * {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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


