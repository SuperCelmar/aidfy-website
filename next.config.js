/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com',                port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'yrasqdvnkyxnhjxftjak.supabase.co', port: '', pathname: '/storage/v1/object/public/automationdfy-assets/**' },
      { protocol: 'https', hostname: 'img.youtube.com',                   port: '', pathname: '/**' },
    ],
  },
  outputFileTracingIncludes: {
    '/api/profile/[company]': ['./profiles/**'],
  },
};

module.exports = nextConfig;
