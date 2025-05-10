/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://blog.pythonforall.com',
    generateRobotsTxt: true,
    sitemapSize: 70000,
    changefreq: 'daily',
    priority: 0.7,
    exclude: ['/admin', '/private-page'],
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: ['/admin', '/private-page'] },
      ],
    },
  };
  