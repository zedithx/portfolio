export default function sitemap() {
  const baseUrl = 'https://www.zedithx.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
