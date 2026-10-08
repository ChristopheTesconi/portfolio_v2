import styles from "./PricingCard.module.css";

interface Package {
  name: string;
  price: string;
  priceNote: string;
  recommended?: boolean;
  installment?: string;
  features: string[];
}

interface PricingCardProps {
  package: Package;
  recommendedLabel: string;
}

export default function PricingCard({
  package: pkg,
  recommendedLabel,
}: PricingCardProps) {
  const isOnQuote = pkg.price === "Sur devis" || pkg.price === "On quote";
  const hasLead = /\s?:$/.test(pkg.features[0] ?? "");
  const lead = hasLead ? pkg.features[0] : null;
  const listItems = hasLead ? pkg.features.slice(1) : pkg.features;
  const priceValue = isOnQuote ? "0" : pkg.price.replace(/[^\d]/g, "");

  return (
    <article
      className={`${styles.card} ${pkg.recommended ? styles.recommended : ""}`}
      itemScope
      itemType="https://schema.org/Offer"
    >
      <meta itemProp="priceCurrency" content="CHF" />
      {!isOnQuote && <meta itemProp="price" content={priceValue} />}
      <meta itemProp="description" content={pkg.features.join(". ")} />
      <meta itemProp="url" content="https://christophetesconidev.com#contact" />
      <meta itemProp="availability" content="https://schema.org/InStock" />

      {pkg.recommended && (
        <div className={styles.badge}>{recommendedLabel}</div>
      )}

      <div className={styles.cardHeader}>
        <h3 className={styles.packageName} itemProp="name">
          {pkg.name}
        </h3>
        {pkg.priceNote && <p className={styles.priceNote}>{pkg.priceNote}</p>}
        <p className={styles.price}>{pkg.price}</p>
        {pkg.installment && (
          <p className={styles.installment}>{pkg.installment}</p>
        )}
        {lead ? (
          <p className={styles.lead}>{lead}</p>
        ) : (
          <p
            className={`${styles.lead} ${styles.leadSpacer}`}
            aria-hidden="true"
          >
            &nbsp;
          </p>
        )}
      </div>

      <ul className={styles.features}>
        {listItems.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </article>
  );
}
