/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desabilitar strict mode para evitar renderizações duplas
  
  // Configurações para ignorar erros no build
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // Uso do modo standalone que é compatível com rotas dinâmicas
  output: 'standalone',
  
  // Otimizações para reduzir o tamanho das funções serverless
  swcMinify: true,
  
  // Otimizações de imagens
  images: {
    unoptimized: true
  },
  
  // Pular validação durante o build
  productionBrowserSourceMaps: true, // Ativar para depuração
  optimizeFonts: false,
  
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'], // Permitir imagens do Google
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ]
  },
  
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js']
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
