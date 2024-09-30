/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   headers: async () => {return [
      {
         source: '/materials/:slug*',
         headers: [
            {
               key: 'Cache-Control',
               value: 'no-store',
            },
         ],
      },
   ]},
};

export default nextConfig;
