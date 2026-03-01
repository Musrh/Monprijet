<template>
  <div style="padding:20px">
    <h2>Test lecture collection commandes</h2>

    <p><strong>Nombre de documents :</strong> {{ count }}</p>

    <div v-for="doc in docs" :key="doc.id" style="margin-bottom:10px;">
      <strong>ID :</strong> {{ doc.id }}
      <pre>{{ doc.data }}</pre>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  data() {
    return {
      count: 0,
      docs: []
    };
  },

  async mounted() {
    try {
      const snapshot = await getDocs(collection(db, "commandes"));

      this.count = snapshot.size;

      this.docs = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));

      console.log("Documents trouvés :", snapshot.size);
    } catch (error) {
      console.error("Erreur Firestore :", error);
    }
  }
};
</script>
