async payer() {
  console.log("CLICK PAYER");
  console.log("USER =", this.$store.state.user);
  console.log("CART =", this.cart);

  if (!this.$store.state.user) {
    alert("Veuillez vous connecter avant de payer");
    this.$router.push("/login");
    return;
  }

  if (!this.cart.length) {
    alert("Panier vide");
    return;
  }

  try {
    const response = await fetch(
      "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: this.cart })
      }
    );

    console.log("RESPONSE STATUS =", response.status);

    const data = await response.json();
    console.log("DATA =", data);

    // ✅ Redirection vers Stripe
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur création session Stripe");
    }

  } catch (error) {
    console.error("Erreur paiement:", error);
    alert("Erreur serveur paiement");
  }
}
