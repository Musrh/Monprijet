<template>
  <div class="p-6 max-w-3xl mx-auto space-y-8 text-gray-800">
    <h1 class="text-3xl font-bold text-center mb-6">🛡️ Conditions de Vente & Politique</h1>

    <!-- Garanties et Retours -->
    <section>
      <h2 class="text-2xl font-semibold mb-2">Garanties et Retours</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Garantie légale : 2 ans en Europe, 1 an aux USA et UK pour défauts matériels.</li>
        <li>Procédure de retour et remboursement : retour possible sous 14 jours pour tous les pays.</li>
        <li>Produits défectueux ou non conformes : remboursement ou remplacement gratuit, partout dans le monde.</li>
      </ul>
    </section>

    <!-- Paiement et Sécurité -->
    <section>
      <h2 class="text-2xl font-semibold mb-2">Paiement et Sécurité</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Paiements sécurisés via Stripe et PayPal.</li>
        <li>Aucune information bancaire n’est stockée sur nos serveurs.</li>
        <li>Monnaie : paiement en € ou $ selon pays.</li>
      </ul>
    </section>

    <!-- Livraison -->
    <section>
      <h2 class="text-2xl font-semibold mb-2">Livraison</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Expédition internationale sous 2 à 7 jours selon le pays.</li>
        <li>Numéro de suivi fourni par email.</li>
        <li>Taxes et droits de douane à la charge du client selon son pays.</li>
      </ul>
    </section>

    <!-- Protection des données -->
    <section>
      <h2 class="text-2xl font-semibold mb-2">Protection des données</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Collecte et usage des données clients uniquement pour la gestion des commandes et marketing.</li>
        <li>Conformité RGPD pour Europe, CCPA pour USA et règles similaires selon les pays.</li>
        <li>Droit d’accès, rectification, suppression des données clients.</li>
        <li>Cookies et suivi marketing pour améliorer l’expérience utilisateur.</li>
      </ul>
    </section>

    <!-- Responsabilité -->
    <section>
      <h2 class="text-2xl font-semibold mb-2">Responsabilité</h2>
      <p>
        Nous déclinons toute responsabilité en cas d’utilisation incorrecte des produits. 
        Les produits sont conformes aux normes locales mais il est de votre responsabilité de vérifier la compatibilité avec votre pays.
      </p>
    </section>

    <!-- Footer -->
    <footer class="text-center text-sm text-gray-500 mt-8">
      © 2026 WellShoppings •
      <a href="#/" class="hover:text-gray-700 underline">Accueil</a> •
      <a href="#/shop" class="hover:text-gray-700 underline">Boutique</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Conditions",
};
</script>

<style scoped>
/* Optionnel : style léger pour mobile et desktop */
</style>
