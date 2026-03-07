<script>
import PayPalButton from "../components/PayPalButton.vue";

export default {
  components: {
    PayPalButton
  },

  data() {
    return {
      paymentMethod: "",
    };
  },

  computed: {
    total() {
      return this.$store.state.cart.reduce(
        (sum, item) => sum + item.prix * item.qty,
        0
      );
    }
  },

  methods: {
    paymentSuccess(details) {
      console.log("Commande validée :", details);

      alert("Commande enregistrée !");
      
      this.$store.commit("clearCart");
    }
  }
};
</script>
