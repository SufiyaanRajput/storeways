import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './home.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div className={styles.transformedRect} />
        <div className={styles.transformedRect} />
        <div className={styles.row}>
          <div className={styles.colLeft}>
            <h1 className={styles.title}>
              Build, launch, and self-host your commerce.
            </h1>
            <ul className={styles.bullets}>
              <li><span>Ready to use out of the box, client storefront, and admin dashboard.</span></li>
              <li><span>Setup your own DB and infrastructure. Deploy anywhere.</span></li>
              <li><span>API-first. Clean architecture. Batteries included, not forced.</span></li>
            </ul>
            <div className={styles.ctaRow}>
              <Link className="button button--primary button--lg" to="/docs/intro">
                Get Started
              </Link>
              <a className={`button button--secondary button--lg ${styles.ghBtn}`} href="https://github.com/SufiyaanRajput/storeways" rel="noreferrer" target="_blank">
                View on GitHub
              </a>
            </div>
          </div>
          <div className={styles.colRight}>
            <img
              src={useBaseUrl('/img/unbox-overview.svg')}
              alt="Carton unboxing Storefront, Admin, and API out of the box"
              className={styles.headerIllustration}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.featuresTitle}>Start in minutes not hours</h2>
          <div className={styles.titleBorderBottom} />
        </div>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLead}>
            Production-ready the moment you fork it. Skip the 100-page setup guides—just fork, run, and start selling.
          </p>
          <ul className={styles.pillRow} role="list">
            <li>Start in minutes</li>
            <li>No vendor lock-in</li>
            <li>Own your data</li>
          </ul>
        </div>
        <div className={styles.showcaseRow}>
          <div className={styles.showcaseContent}>
            <div className={styles.eyebrow}>Client storefront included</div>
            <h3 className={styles.showcaseTitle}>Beautiful, responsive storefront out of the box</h3>
            <p className={styles.showcaseDesc}>
              Launch fast with a production-ready storefront built on modern standards.
              Customize the theme, swap components, or build your own using the clean APIs.
            </p>
            <ul className={styles.bulletList}>
              <li>SEO-friendly Next.js pages and routes</li>
              <li>Responsive product grids and product detail pages</li>
              <li>Cart, checkout, and order history flows</li>
            </ul>
            <div className={styles.showcaseCtas}>
              <Link className="button button--primary button--md" to="/docs/client">Explore the Storefront</Link>
              <Link className="button button--secondary button--md" to="/docs/get-started">Get Started</Link>
            </div>
          </div>
          <div className={styles.showcaseImage}>
            <img
              src={useBaseUrl('/img/storefront-placeholder.svg')}
              alt="Sample screenshot of the included client storefront"
              className={styles.screenshot}
              loading="lazy"
            />
          </div>
        </div>
        <div className={`${styles.showcaseRow} ${styles.reverse}`}>
          <div className={styles.showcaseContent}>
            <div className={styles.eyebrow}>Powerful admin dashboard</div>
            <h3 className={styles.showcaseTitle}>Manage products, orders, and settings without code</h3>
            <p className={styles.showcaseDesc}>
              A sleek admin UI lets you manage your store, inventory, variations, and more.
              Most customizations are available right in the dashboard—no need to edit code.
            </p>
            <ul className={styles.bulletList}>
              <li>Products, categories, variations, stock, etc</li>
              <li>Customize your storefront that goes with your brand</li>
              <li>Drop sections to your storefront for the products that matter</li>
            </ul>
            <div className={styles.showcaseCtas}>
              <Link className="button button--primary button--md" to="/docs/admin">See the Admin</Link>
              <Link className="button button--secondary button--md" to="/docs/server">How it works</Link>
            </div>
          </div>
          <div className={styles.showcaseImage}>
            <img
              src={useBaseUrl('/img/admin-ui-placeholder.svg')}
              alt="Sample screenshot of the admin dashboard"
              className={styles.screenshot}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.titleWrapper}>
          <h2 className={styles.featuresTitle}>Why Storeways</h2>
          <div className={styles.titleBorderBottom} />
        </div>
        <div className={styles.featureRow}>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="3" y="3" width="8" height="8" rx="2"></rect>
                <rect x="13" y="3" width="8" height="8" rx="2"></rect>
                <rect x="3" y="13" width="8" height="8" rx="2"></rect>
                <rect x="13" y="13" width="8" height="8" rx="2"></rect>
              </svg>
            </div>
            <h5>Modular by design</h5>
            <p>Compose core domains and swap integrations.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M17 17H7a4 4 0 0 1 0-8 5 5 0 0 1 9.58-1.36A3.5 3.5 0 0 1 17 17z"></path>
                <circle cx="12" cy="13" r="2"></circle>
                <path d="M12 9.5v1.5"></path>
                <path d="M12 15v1.5"></path>
                <path d="M9.5 13h1.5"></path>
                <path d="M13 13h1.5"></path>
                <path d="M10.4 10.4l1.1 1.1"></path>
                <path d="M13.6 15.6l-1.1-1.1"></path>
                <path d="M13.6 10.4l-1.1 1.1"></path>
                <path d="M10.4 15.6l1.1-1.1"></path>
              </svg>
            </div>
            <h5>API-first</h5>
            <p>Clean APIs for client. Build your own storefronts with ease.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                <path d="M8 7h.01"></path>
                <path d="M8 17h.01"></path>
              </svg>
            </div>
            <h5>Self-host friendly</h5>
            <p>Run locally or in your own cloud. Keep control of your data and costs.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M3 7l9-4 9 4-9 4-9-4z"></path>
                <path d="M21 7v10l-9 4-9-4V7"></path>
                <path d="M12 11v10"></path>
              </svg>
            </div>
            <h5>Batteries included</h5>
            <p>Payments, products, orders, customers, admin UI, and more—ready to use.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"></path>
                <circle cx="5" cy="10" r="2"></circle>
                <circle cx="19" cy="10" r="2"></circle>
                <path d="M2 20c0-2.209 2.239-4 5-4"></path>
                <path d="M22 20c0-2.209-2.239-4-5-4"></path>
              </svg>
            </div>
            <h5>Open-source</h5>
            <p>MIT license, transparent development, and a welcoming contributor community.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M21 14a9 9 0 1 0-18 0"></path>
                <path d="M12 14l5-5"></path>
                <circle cx="12" cy="14" r="1"></circle>
              </svg>
            </div>
            <h5>Production-ready</h5>
            <p>Ship fast with sensible defaults, then scale with your needs.</p>
          </div>
        </div>
        <div className={styles.bannerCard}>
          <h3>Get started in minutes</h3>
          <p>Spin up the server, connect a DB, and make your first API call.</p>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the Docs
          </Link>
        </div>
      </section>
    </main>
  );
}
