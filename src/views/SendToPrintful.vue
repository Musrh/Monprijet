<template>
  <div>
    <h2>Envoyer commande à Printful</h2>

    <form @submit.prevent="sendToPrintful">
      <label>Email :</label>
      <input v-model="email" type="text" />

      <label>Adresse :</label>
      <input v-model="adresseLivraison" type="text" />

      <label>Ville :</label>
      <input v-model="city" type="text" />

      <label>Code Postal :</label>
      <input v-model="zip" type="text" />

      <label>Pays :</label>
      <input v-model="pays" type="text" />

      <button type="submit">Envoyer à Printful</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: ["orderId"],
  data() {
    return {
      email: "",
      adresseLivraison: "",
      city: "",
      zip: "",
      pays: "FR",
      message: ""
    };
  },
  methods: {
    async sendToPrintful() {
      try {
        const res = await fetch(
          `https://printfulpasscommandes-production.up.railway.app/admin/send-to-printful/${this.orderId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: this.email,
              adresseLivraison: this.adresseLivraison,
              city: this.city,
              zip: this.zip,
              pays: this.pays
            })
          }
        );

        const data = await res.json();
        if (data.success) this.message = "✅ Commande envoyée à Printful";
        else this.message = "❌ " + data.message;
      } catch (err) {
        console.error(err);
        this.message = "❌ Erreur lors de l'envoi";
      }
    }
  }
};
</script>
