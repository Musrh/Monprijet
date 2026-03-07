<template>
  <div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script>
export default {
  props: ["amount"],
  mounted() {
    this.renderButton();
  },
  methods: {
    renderButton() {
      if (!window.paypal) {
        console.error("PayPal SDK non chargé");
        return;
      }

      window.paypal.Buttons({

        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.amount
              }
            }]
          });
        },

        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {

            alert("Paiement réussi par " + details.payer.name.given_name);

            this.$emit("success", details);

          });
        },

        onError: (err) => {
          console.error("Erreur PayPal", err);
        }

      }).render("#paypal-button-container");
    }
  }
};
</script>
