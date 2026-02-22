<template>
  <div v-if="adminLoaded">
    <div v-if="isAdmin">
      <!-- Panneau admin complet -->
      <h1>Admin Panel</h1>
    </div>
    <div v-else>
      <p>Vous n'êtes pas admin.</p>
    </div>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  setup() {
    const user = ref(null);
    const isAdmin = ref(false);
    const adminLoaded = ref(false); // ← ajoute cette variable pour attendre Firebase

    onMounted(() => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          adminLoaded.value = true; // chargé mais non connecté
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          user.value = { uid: currentUser.uid, ...userDoc.data() };
          isAdmin.value = user.value.role?.toLowerCase() === 'admin';
        }
        adminLoaded.value = true; // indique que la vérification est terminée
      });
    });

    return { user, isAdmin, adminLoaded };
  }
};
</script>
