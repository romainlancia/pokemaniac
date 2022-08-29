/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['raw.githubusercontent.com', "img.pokemondb.net"],
    formats: ["image/webp"],
  },
}

module.exports = nextConfig
