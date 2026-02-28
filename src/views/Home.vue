<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      produits: [],
      currentIndex: 0,
      intervalId: null
    };
  },

  async mounted() {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      this.produits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 🔥 Démarrer autoplay après chargement
      this.startAutoSlide();

    } catch (error) {
      console.error("Erreur Firestore :", error);
    }
  },

  beforeUnmount() {
    this.stopAutoSlide();
  },

  methods: {
    next() {
      this.currentIndex =
        (this.currentIndex + 1) % this.produits.length;
    },

    prev() {
      this.currentIndex =
        (this.currentIndex - 1 + this.produits.length) % this.produits.length;
    },

    startAutoSlide() {
      this.intervalId = setInterval(() => {
        this.next();
      }, 3000); // ⏱ toutes les 3 secondes
    },

    stopAutoSlide() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }
};
</script>
