import React from 'react';
import Link from '@docusaurus/Link';
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
              Build, launch, and self-host your commerce. For developers.
            </h1>
            <ul className={styles.bullets}>
              <li><span>MIT-licensed. Modular server, client SDK, and admin dashboard.</span></li>
              <li><span>Bring your own DB and infrastructure. Deploy anywhere.</span></li>
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
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div /><div /><div />
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewStat}>
                  <div className={styles.previewStatValue}>$12,480</div>
                  <div className={styles.previewStatLabel}>MRR</div>
                </div>
                <div className={styles.previewStat}>
                  <div className={styles.previewStatValue}>1,204</div>
                  <div className={styles.previewStatLabel}>Orders</div>
                </div>
                <div className={styles.previewStat}>
                  <div className={styles.previewStatValue}>3.2%</div>
                  <div className={styles.previewStatLabel}>CR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.featuresTitle}>Why Storeways</h2>
          <div className={styles.titleBorderBottom} />
        </div>
        <div className={styles.featureRow}>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>🧩</div>
            <h5>Modular by design</h5>
            <p>Compose core domains and swap integrations without forking the codebase.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>⚙️</div>
            <h5>API-first</h5>
            <p>Clean, typed APIs for server and client. Build your own storefronts with ease.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>🗄️</div>
            <h5>Self-host friendly</h5>
            <p>Run locally or in your own cloud. Keep control of your data and costs.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>🔌</div>
            <h5>Batteries included</h5>
            <p>Payments, products, orders, customers, admin UI, and more—ready to use.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>🛡️</div>
            <h5>Open-source</h5>
            <p>MIT license, transparent development, and a welcoming contributor community.</p>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon} aria-hidden>🚀</div>
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
