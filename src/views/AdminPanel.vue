<template>
  <div v-if="loading">
    <p>Chargement...</p>
  </div>

  <div v-else>
    <div v-if="isAdmin">
      <h1>Admin Panel</h1>
      <p>Bienvenue, {{ user.email }}</p>
      <!-- Ici tu peux ajouter commandes, utilisateurs, produits -->
    </div>
    <div v-else>
      <p>Vous n'êtes pas admin.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default {
  setup() {
    const loading = ref(true);
    const user = ref(null);
    const isAdmin = ref(false);

    onMounted(() => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          loading.value = false;
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          user.value = { uid: currentUser.uid, ...userDoc.data() };
          isAdmin.value = user.value.role?.toLowerCase() === 'admin';
        }
        loading.value = false; // fin du chargement, on peut afficher le panneau
      });
    });

    return { loading, user, isAdmin };
  }
};
</script>
