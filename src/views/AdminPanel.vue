<template>
  <div v-if="isAdmin">
    <h1>Admin Panel</h1>
    <!-- Ici tu peux mettre tes sections utilisateurs, produits, commandes -->
  </div>
  <div v-else>
    <p>Vous n'êtes pas admin.</p>
  </div>

  <p>Utilisateur : {{ user?.email }}</p>
  <p>Role : {{ user?.role }}</p>
  <p>isAdmin : {{ isAdmin }}</p>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  setup() {
    const user = ref(null);
    const isAdmin = ref(false);

    onMounted(() => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) return;

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          user.value = { uid: currentUser.uid, ...userDoc.data() };
          isAdmin.value = user.value.role?.toLowerCase() === 'admin';
        }
      });
    });

    return { user, isAdmin };
  }
};
</script>
