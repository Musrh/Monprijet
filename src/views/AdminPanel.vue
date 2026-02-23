<template>
  <div>
    <h1>Test Users</h1>
    <ul>
      <li v-for="u in users" :key="u.uid">
        {{ u.email }} - {{ u.role }}
      </li>
    </ul>
    <p v-if="users.length === 0">Aucun utilisateur trouvé</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  setup() {
    const users = ref([]);

    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        console.log("Users récupérés :", users.value);
      } catch (err) {
        console.error("Erreur récupération users :", err);
      }
    };

    onMounted(fetchUsers);
    return { users };
  }
};
</script>
