import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'afc'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'b46'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '7b8'),
            routes: [
              {
                path: '/docs/admin',
                component: ComponentCreator('/docs/admin', '6de'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture',
                component: ComponentCreator('/docs/architecture', '4b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client',
                component: ComponentCreator('/docs/client', 'caa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/contributing',
                component: ComponentCreator('/docs/contributing', '069'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/get-started',
                component: ComponentCreator('/docs/get-started', '8eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/license',
                component: ComponentCreator('/docs/license', '773'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/server',
                component: ComponentCreator('/docs/server', 'fc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/server/plugins',
                component: ComponentCreator('/docs/server/plugins', '014'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '070'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
