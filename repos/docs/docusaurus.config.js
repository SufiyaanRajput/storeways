// @ts-check
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Storeways',
  tagline: 'Open-source e-commerce platform',
  url: 'https://storeways.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'storeways',
  projectName: 'docs',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/SufiyaanRajput/storeways/edit/main/repos/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Storeways',
        logo: {
          alt: 'Storeways Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/SufiyaanRajput/storeways',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/docs/intro' },
              { label: 'Architecture', to: '/docs/architecture' },
              { label: 'Server (API)', to: '/docs/server' },
            ],
          },
          {
            title: 'Packages',
            items: [
              { label: 'Server', to: '/docs/server' },
              { label: 'Client', to: '/docs/client' },
              { label: 'Admin', to: '/docs/admin' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'GitHub Issues', href: 'https://github.com/SufiyaanRajput/storeways/issues' },
              { label: 'Discussions', href: 'https://github.com/SufiyaanRajput/storeways/discussions' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Storeways. MIT Licensed.`,
      }
    }),
};

module.exports = config;


