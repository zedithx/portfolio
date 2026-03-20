export default function manifest() {
  return {
    name: 'Yang Si Jun — Portfolio',
    short_name: 'zedithx',
    description:
      'Interactive macOS-themed developer portfolio of Yang Si Jun.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
