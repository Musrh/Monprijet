<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  methods: {
    async checkout() {
      try {
        const stripe = await loadStripe(
          'pk_test_51T20K6AwgHqDmd0F8LcnioXKpuzSyQv7aPkDhhmtPEH9BA98KOzf6F43K2O4A5WjhHHVlguyp48W0bmqMbwSvcDm00YINXIME3'
        );

        const response = await fetch(
          'https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const data = await response.json();
        console.log("Réponse backend :", data);

        if (!response.ok) {
          throw new Error(data.error || "Erreur backend");
        }

        await stripe.redirectToCheckout({
          sessionId: data.id,
        });

      } catch (error) {
        console.error("Erreur complète :", error);
        alert(error.message);
      }
    }
  }
}
</script>
