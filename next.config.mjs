/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The sidebar was restructured from 20 flat routes into a condensed,
  // nested hierarchy (see src/lib/navigation.ts). These redirects keep any
  // bookmarked or previously-shared links from the old structure working.
  async redirects() {
    return [
      { source: "/vision-goals", destination: "/vision", permanent: true },
      { source: "/life-planner", destination: "/life/planner", permanent: true },
      { source: "/decision-journal", destination: "/journal/decisions", permanent: true },
      { source: "/business-portfolio", destination: "/business", permanent: true },
      { source: "/knowledge-base", destination: "/growth/knowledge", permanent: true },
      { source: "/learning-hub", destination: "/growth/learning", permanent: true },
      { source: "/idea-vault", destination: "/ideas", permanent: true },
      { source: "/personal-finance", destination: "/money/finance", permanent: true },
      { source: "/assets", destination: "/money/assets", permanent: true },
      { source: "/documents", destination: "/life/documents", permanent: true },
      { source: "/habits", destination: "/life/habits", permanent: true },
      { source: "/health", destination: "/life/health", permanent: true },
      { source: "/relationships", destination: "/life/relationships", permanent: true },
      { source: "/travel", destination: "/life/travel", permanent: true },
      { source: "/ai-coach", destination: "/coach", permanent: true },
      { source: "/analytics", destination: "/growth/analytics", permanent: true },
    ];
  },
};

export default nextConfig;
