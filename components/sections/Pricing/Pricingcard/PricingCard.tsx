import styles from "./PricingCard.module.css";

interface Package {
  name: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  features: string[];
}

interface PricingCardProps {
  package: Package;
}

export default function PricingCard({ package: pkg }: PricingCardProps) {
  // ✅ DÉTECTION DU TYPE DE PRIX
  const isOnQuote = pkg.price === "Sur devis" || pkg.price === "On quote";
  const priceValue = isOnQuote ? "0" : pkg.price.replace(/[^\d]/g, "");

  return (
    <article
      className={`${styles.card} ${pkg.popular ? styles.popular : ""}`}
      itemScope
      itemType="https://schema.org/Offer"
    >
      {/* ✅ META CACHÉES POUR SCHEMA.ORG */}
      <meta itemProp="priceCurrency" content="CHF" />
      {!isOnQuote && <meta itemProp="price" content={priceValue} />}
      <meta itemProp="description" content={pkg.features.join(". ")} />
      <meta itemProp="url" content="https://christophetesconidev.com#contact" />
      <meta itemProp="availability" content="https://schema.org/InStock" />

      {pkg.popular && <div className={styles.badge}>Populaire</div>}

      <div className={styles.cardHeader}>
        <h3 className={styles.packageName} itemProp="name">
          {pkg.name}
        </h3>
        {pkg.priceNote && <p className={styles.priceNote}>{pkg.priceNote}</p>}
        <p className={styles.price}>{pkg.price}</p>
      </div>

      <ul className={styles.features}>
        {pkg.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </article>
  );
}
