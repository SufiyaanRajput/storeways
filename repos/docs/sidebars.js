/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'get-started',
        'architecture',
        'admin',
        'client',
        {
          type: 'category',
          label: 'Server (API)',
          collapsed: false,
          items: [
            'server',
            'server/plugins',
          ],
        },
        'contributing',
        'license'
      ],
    },
  ],
};

module.exports = sidebars;


