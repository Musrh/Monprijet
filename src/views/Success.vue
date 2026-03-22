<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["cart", "user"]),
  },

  async mounted() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("token"); // PayPal renvoie token

    if (!orderId) return;

    try {
      console.log("Capture PayPal pour:", orderId);

      await axios.post(
        "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
        {
          orderId,
          email: this.user.email,
          adresseLivraison: "Adresse déjà fournie",
          items: this.cart,
        }
      );

      this.$store.commit("clearCart");

    } catch (err) {
      console.error("Erreur capture PayPal:", err);
    }
  },
};
</script>
