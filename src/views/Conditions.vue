<template>
  <div class="max-w-4xl mx-auto px-4 py-8 text-sm leading-6">

    <h1 class="text-2xl font-bold mb-6">
      {{ content.title }}
    </h1>

    <div class="space-y-6">

      <section>
        <h2 class="font-bold text-lg mb-2">
          {{ content.warrantyTitle }}
        </h2>
        <p>{{ content.warranty1 }}</p>
        <p>{{ content.warranty2 }}</p>
        <p>{{ content.warranty3 }}</p>
      </section>

      <section>
        <h2 class="font-bold text-lg mb-2">
          {{ content.paymentTitle }}
        </h2>
        <p>{{ content.payment1 }}</p>
        <p>{{ content.payment2 }}</p>
        <p>{{ content.payment3 }}</p>
      </section>

      <section>
        <h2 class="font-bold text-lg mb-2">
          {{ content.deliveryTitle }}
        </h2>
        <p>{{ content.delivery1 }}</p>
        <p>{{ content.delivery2 }}</p>
        <p>{{ content.delivery3 }}</p>
      </section>

      <section>
        <h2 class="font-bold text-lg mb-2">
          {{ content.dataTitle }}
        </h2>
        <p>{{ content.data1 }}</p>
        <p>{{ content.data2 }}</p>
        <p>{{ content.data3 }}</p>
        <p>{{ content.data4 }}</p>
      </section>

      <section>
        <h2 class="font-bold text-lg mb-2">
          {{ content.responsibilityTitle }}
        </h2>
        <p>{{ content.responsibility1 }}</p>
      </section>

    </div>

  </div>
</template>

<script>
export default {
  name: "Conditions",

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "en";
    },

    content() {
      const translations = {

        // 🇫🇷 Français
        fr: {
          title: "Conditions de Vente & Politique",

          warrantyTitle: "Garanties et Retours",
          warranty1: "Garantie légale : 2 ans en Europe, 1 an aux USA et UK pour défauts matériels.",
          warranty2: "Procédure de retour et remboursement : retour possible sous 14 jours pour tous les pays.",
          warranty3: "Produits défectueux ou non conformes : remboursement ou remplacement gratuit, partout dans le monde.",

          paymentTitle: "Paiement et Sécurité",
          payment1: "Paiements sécurisés via Stripe et PayPal.",
          payment2: "Aucune information bancaire n’est stockée sur nos serveurs.",
          payment3: "Monnaie : paiement en € ou $ selon pays.",

          deliveryTitle: "Livraison",
          delivery1: "Expédition internationale sous 7 à 30 jours selon le pays.",
          delivery2: "Numéro de suivi fourni par email.",
          delivery3: "Taxes et droits de douane à la charge du client selon son pays.",

          dataTitle: "Protection des données",
          data1: "Collecte et usage des données clients uniquement pour la gestion des commandes et marketing.",
          data2: "Conformité RGPD pour Europe, CCPA pour USA et règles similaires selon les pays.",
          data3: "Droit d’accès, rectification, suppression des données clients.",
          data4: "Cookies et suivi marketing pour améliorer l’expérience utilisateur.",

          responsibilityTitle: "Responsabilité",
          responsibility1: "Nous déclinons toute responsabilité en cas d’utilisation incorrecte des produits. Les produits sont conformes aux normes locales mais il est de votre responsabilité de vérifier la compatibilité avec votre pays."
        },

        // 🇬🇧 English (default)
        en: {
          title: "Terms of Sale & Policy",

          warrantyTitle: "Warranty & Returns",
          warranty1: "Legal warranty: 2 years in Europe, 1 year in the USA and UK for material defects.",
          warranty2: "Return and refund policy: returns accepted within 14 days for all countries.",
          warranty3: "Defective or non-compliant products: free refund or replacement worldwide.",

          paymentTitle: "Payment & Security",
          payment1: "Secure payments via Stripe and PayPal.",
          payment2: "No banking information is stored on our servers.",
          payment3: "Currency: payment in € or $ depending on the country.",

          deliveryTitle: "Shipping",
          delivery1: "International shipping within 7 to 30 days depending on the country.",
          delivery2: "Tracking number provided by email.",
          delivery3: "Customs taxes and duties are the responsibility of the customer according to their country.",

          dataTitle: "Data Protection",
          data1: "Customer data is collected and used only for order management and marketing purposes.",
          data2: "GDPR compliant for Europe, CCPA for USA and similar regulations depending on the country.",
          data3: "Right of access, correction and deletion of customer data.",
          data4: "Cookies and marketing tracking are used to improve user experience.",

          responsibilityTitle: "Liability",
          responsibility1: "We decline any responsibility for improper use of products. Products comply with local standards, but it is your responsibility to verify compatibility with your country."
        }

      };

      return translations[this.currentLang] || translations.en;
    }
  }
};
</script>
