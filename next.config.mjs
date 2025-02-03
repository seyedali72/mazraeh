/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/uploads/:path*',
                destination: '/uploads/:path*', // مسیر استاتیک
            },
        ];
    },};

export default nextConfig;
