<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Success",
  data() {
    return {
      loading: true,
      success: false,
      error: false,
    };
  },
  computed: {
    ...mapState(["user", "cart"]),
  },
  async mounted() {
    const sessionId = this.$route.query.session_id;
    const paypalToken = this.$route.query.token;

    try {
      // ================= STRIPE =================
      if (sessionId) {
        console.log("Stripe success:", sessionId);
        this.success = true;
      }

      // ================= PAYPAL =================
      if (paypalToken) {
        console.log("Capture PayPal order:", paypalToken);

        if (!this.user || !this.user.email) {
          throw new Error("Utilisateur non connecté");
        }

        const response = await axios.post(
          "https://paypalbackend-production.up.railway.app/capture-paypal-order",
          {
            orderId: paypalToken,
            email: this.user.email,
            items: this.cart || [],
            adresseLivraison: localStorage.getItem("adresseLivraison") || "",
          }
        );

        if (response.data.success) {
          this.success = true;

          // 🔹 Nettoyage
          localStorage.removeItem("adresseLivraison");
          this.$store.commit("clearCart"); // si mutation existe
        } else {
          throw new Error("Capture non confirmée");
        }
      }
    } catch (err) {
      console.error("Erreur Success:", err);
      this.error = true;
    }

    this.loading = false;
  },
};
</script>
