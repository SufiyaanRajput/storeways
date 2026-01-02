export const LAYOUT_SECTIONS = {
  CAROUSEL: 'CAROUSEL',
  BANNER: 'BANNER',
  POSTERS: 'POSTERS',
  PRODUCTS: 'PRODUCTS',
  PRODUCTS_CAROUSEL: 'PRODUCTS_CAROUSEL',
  FEATURES: 'FEATURES',
  BLOG_CAROUSEL: 'BLOG_CAROUSEL',
  NEWSLETTER: 'NEWSLETTER'
};

export default {
  pages: {
    home: {
      layout: [
        {
          id: LAYOUT_SECTIONS.CAROUSEL,
          key: "CAROUSEL_62e3b8bf998bd",
          items: [
            {
              cta: {
                text: "Shop Now",
                type: "primary",
                align: "center",
                targetLink: "/shop"
              },
              align: {
                vertical: "center",
                horizontal: "center"
              },
              title: {
                text: "For the only sneaker heads!",
                color: {
                  a: 1,
                  b: 0,
                  g: 0,
                  r: 0
                },
                bgColor: {
                  a: 0,
                  b: 75,
                  g: 145,
                  r: 145
                }
              },
              banner: {
                uid: "__AUTO__1646319949354_0__",
                url: "https://ik.imagekit.io/oceanlabs/banners/1646319804340_yTkas0H42f0p",
                name: "1646319804340_yTkas0H42f0p",
                fileId: "6220d8bdad10816a2feab056",
                filePath: "/banners/1646319804340_yTkas0H42f0p"
              }
            },
            {
              cta: {
                text: "Shop Now",
                type: "primary",
                align: "center",
                targetLink: "/shop"
              },
              align: {
                vertical: "flex-end",
                horizontal: "center"
              },
              title: {
                text: "Its in the AIR",
                color: {
                  a: 1,
                  b: 0,
                  g: 0,
                  r: 0
                },
                bgColor: {
                  a: 0.43,
                  b: 255,
                  g: 255,
                  r: 255
                }
              },
              banner: {
                uid: "__AUTO__1646279390257_0__",
                url: "https://images.unsplash.com/photo-1508124721291-db7395d5f59a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjk0fHxzbmVha2VyfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
              }
            }
          ],
          width: "full",
          selected: true
        },
        {
          id: LAYOUT_SECTIONS.BANNER,
          key: "BANNER_768768767866SDS",
          items: {
            cta: {
              text: "Shop now",
              type: "primary",
              align: "center",
              targetLink: "http://mystore6.localhost.com:3000/shop?categories=30"
            },
            align: {
              vertical: "center",
              horizontal: "center"
            },
            title: {
              text: "The latest in trends arrives now!",
              color: {
                a: 1,
                b: 255,
                g: 255,
                r: 255
              },
              bgColor: {
                a: 1,
                b: 0,
                g: 0,
                r: 0
              }
            },
            banner: {
              uid: "__AUTO__1646886841042_0__",
              url: "https://ik.imagekit.io/oceanlabs/banners/1646886838530_5XOwj1hoc",
              name: "1646886838530_5XOwj1hoc",
              fileId: "62297fb8d1fca64c0f25ed2f",
              filePath: "/banners/1646886838530_5XOwj1hoc"
            }
          }
        },
        {
          id: LAYOUT_SECTIONS.POSTERS,
          key: "POSTERS_6b458e1c9918b",
          items: [
            {
              alt: "Some description",
              poster: {
                uid: "__AUTO__1646319897529_0__",
                url: "https://ik.imagekit.io/oceanlabs/posters/1646319896019_soonf60Ijn",
                name: "1646319896019_soonf60Ijn",
                fileId: "6220d9197a5e793af9944095",
                filePath: "/posters/1646319896019_soonf60Ijn"
              },
              targetLink: "https://www.google.com"
            },
            {
              poster: {
                url: "https://ik.imagekit.io/oceanlabs/posters/1646406474393_rlZrU-uZOM",
                name: "1646406474393_rlZrU-uZOM",
                fileId: "62222b4b543c542965c1d406",
                filePath: "/posters/1646406474393_rlZrU-uZOM"
              },
              targetLink: "https://www.google.com"
            },
            {
              poster: {
                uid: "__AUTO__1646319909683_2__",
                url: "https://ik.imagekit.io/oceanlabs/posters/1646319908415_tgSmgn-nfEp2",
                name: "1646319908415_tgSmgn-nfEp2",
                fileId: "6220d925ad10816a2feab0bf",
                filePath: "/posters/1646319908415_tgSmgn-nfEp2"
              },
              targetLink: "https://www.google.com"
            }
          ],
          colSize: 6,
          selected: true
        },
        {
          id: LAYOUT_SECTIONS.PRODUCTS,
          key: "PRODUCTS_5cafd0aa13c58",
          selected: true,
          selection: {
            type: "LATEST",
            limit: 4
          }
        },
        {
          id: LAYOUT_SECTIONS.FEATURES,
          key: "FEATURES_1ff35b97fdbca",
          items: [
            {
              title: "Feature One",
              description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here"
            },
            {
              title: "Feature Two",
              description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here"
            },
            {
              title: "Feature Three",
              description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here"
            }
          ],
          sectionBgColor: {
            a: 1,
            b: 255,
            g: 255,
            r: 255
          }
        },
        {
          id: LAYOUT_SECTIONS.NEWSLETTER,
          key: "NEWSLETTER_988b6185efcc9",
          selected: true
        }
      ],
      blogIds: {},
      productIds: {}
    }
  },
  store: {
    tax: {},
    theme: {
      brandColor: "#000000",
      navTextColor: "#000000",
      navBackgroundColor: "#ffffff"
    },
    logoText: "Classic",
    otherCharges: {}
  },
  footer: {
    logo: null,
    email: "admin@classic.com",
    phone: "(615) 581-0406",
    bgColor: {
      a: 1,
      b: 0,
      g: 0,
      r: 0
    },
    summary: "It is a long test established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here",
    twitter: "https://www.twitter.com",
    facebook: "https://www.fb.com",
    sections: [
      {
        links: [
          {
            link: "/careers",
            title: "Careers"
          },
          {
            link: "/privacy",
            title: "Privacy Policy"
          },
          {
            link: "/terms",
            title: "Terms & Conditions"
          }
        ],
        title: "Quick links"
      },
      {
        links: [
          {
            link: "/contact",
            title: "Contact Us"
          },
          {
            link: "/faq",
            title: "FAQ"
          },
          {
            link: "/return-refunds",
            title: "Returns & Refunds"
          }
        ],
        title: "Quick links 2"
      }
    ],
    instagram: "https://www.instagram.com",
    copyrightText: "Coyright© 2022 Classic all rights reserved.",
    officeAddress: "21 Mount Vernon Ct White House, Tennessee(TN), 37188"
  }
};