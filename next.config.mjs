/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          "firebasestorage.googleapis.com",
        ],
      },
    async rewrites() {
        return [
          // Rewrite cryptocurrency routes to the dynamic coin page
          { source: '/bitcoin', destination: '/coin/bitcoin' },
          { source: '/ethereum', destination: '/coin/ethereum' },
          { source: '/tether', destination: '/coin/tether' },
          { source: '/binancecoin', destination: '/coin/binancecoin' },
          { source: '/solana', destination: '/coin/solana' },
          { source: '/ripple', destination: '/coin/ripple' },
          { source: '/usd-coin', destination: '/coin/usd-coin' },
          { source: '/cardano', destination: '/coin/cardano' },
          { source: '/dogecoin', destination: '/coin/dogecoin' },
          { source: '/tron', destination: '/coin/tron' },
          { source: '/staked-ether', destination: '/coin/staked-ether' },
          { source: '/wrapped-bitcoin', destination: '/coin/wrapped-bitcoin' },
          { source: '/chainlink', destination: '/coin/chainlink' },
          { source: '/avalanche', destination: '/coin/avalanche' },
          { source: '/shiba-inu', destination: '/coin/shiba-inu' },
          { source: '/sui', destination: '/coin/sui' },
          { source: '/stellar', destination: '/coin/stellar' },
          { source: '/bitcoin-cash', destination: '/coin/bitcoin-cash' },
          { source: '/polkadot', destination: '/coin/polkadot' },
          { source: '/hyperliquid', destination: '/coin/hyperliquid' },
          { source: '/litecoin', destination: '/coin/litecoin' },
          { source: '/uniswap', destination: '/coin/uniswap' },
          { source: '/near', destination: '/coin/near' },
          { source: '/pepe', destination: '/coin/pepe' },
          { source: '/aptos', destination: '/coin/aptos' },
        ];
      },
};

export default nextConfig;
