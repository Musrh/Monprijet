async sendToPrintful() {
  if (!this.selectedOrder) return;

  console.log("🟢 Order ID envoyé :", this.selectedOrder.id);
  console.log("🟢 URL appelée :",
    `https://printfulpasscommandes-production.up.railway.app/admin/send-to-printful/${this.selectedOrder.id}`
  );
  console.log("🟢 Données envoyées :", this.selectedOrder);

  try {
    const res = await axios.post(
      `https://printfulpasscommandes-production.up.railway.app/admin/send-to-printful/${this.selectedOrder.id}`,
      this.selectedOrder
    );

    console.log("🟢 Réponse serveur :", res.data);

    if (res.data.success) {
      this.message = `Commande envoyée ✅ Printful ID: ${res.data.printfulOrderId}`;
      this.error = "";
    } else {
      this.error = res.data.message;
      this.message = "";
    }

  } catch (err) {
    console.error("🔴 Erreur Axios :", err.response?.data || err.message);
    this.error = err.response?.data?.message || "Erreur envoi ❌";
    this.message = "";
  }
}
