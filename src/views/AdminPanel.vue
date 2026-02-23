<template>
  <div class="p-4">
    <h1>Admin Panel - Utilisateurs</h1>

    <!-- Vérification admin -->
    <div v-if="!isAdmin">
      <p style="color:red">Accès refusé ❌</p>
    </div>

    <div v-else>
      <section>
        <h2>Liste des utilisateurs</h2>
        <div v-if="users.length === 0">Aucun utilisateur trouvé</div>
        <ul>
          <li v-for="user in users" :key="user.uid">
            {{ user.email }} - {{ user.role }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase"; // Assurez-vous que ce fichier existe et exporte correctement `db`
import { collection, getDocs } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);

    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        console.log("Users récupérés :", users.value);
      } catch (error) {
        console.error("Erreur récupération users :", error);
      }
    };

    onMounted(fetchUsers);

    return { users };
  },

  computed: {
    ...mapGetters(["isAdmin"])
  }
};
</script>

<style scoped>
ul { list-style: none; padding: 0; }
li { padding: 6px 0; border-bottom: 1px solid #ccc; }
</style>
