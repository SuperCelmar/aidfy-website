/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'resources.ediblearrangements.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'rescloud.ediblearrangements.com',    port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com',                port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'yrasqdvnkyxnhjxftjak.supabase.co', port: '', pathname: '/storage/v1/object/public/automationdfy-assets/**' },
    ],
  },
};

module.exports = nextConfig;
