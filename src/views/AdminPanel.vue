<template>
  <div class="p-4">
    <h1>Admin Panel</h1>

    <div v-if="!isAdmin">
      <p style="color:red">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- USERS -->
      <section>
        <h2>Utilisateurs</h2>
        <ul>
          <li v-for="user in users" :key="user.uid">
            {{ user.email }} - {{ user.role }}
          </li>
        </ul>
      </section>

      <!-- PRODUCTS -->
      <section>
        <h2>Produits</h2>
        <form @submit.prevent="addProduct">
          <input v-model="newProduct.nom" placeholder="Nom" required>
          <input v-model.number="newProduct.prix" placeholder="Prix" type="number" required>
          <input v-model.number="newProduct.quantity" placeholder="Quantité" type="number" required>
          <button type="submit">Ajouter</button>
        </form>

        <ul>
          <li v-for="prod in products" :key="prod.id">
            {{ prod.nom }} - {{ prod.prix }} € - Stock: {{ prod.quantity }}
            <button @click="deleteProduct(prod.id)">Supprimer</button>
          </li>
        </ul>
      </section>

      <!-- COMMANDES -->
      <section>
        <h2>Commandes</h2>
        <label>Filtrer par statut:</label>
        <select v-model="statusFilter" @change="filterCommandes">
          <option value="">Tous</option>
          <option value="En attente">En attente</option>
          <option value="Payé">Payé</option>
        </select>

        <ul>
          <li v-for="commande in commandesFiltered" :key="commande.id">
            Client: {{ commande.email }} | Statut: {{ commande.Statut }}
            <ul>
              <li v-for="item in commande.items" :key="item.nom">
                {{ item.nom }} x{{ item.Quantity }} - {{ item.prix }} €
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const products = ref([]);
    const commandes = ref([]);
    const commandesFiltered = ref([]);
    const statusFilter = ref("");

    const newProduct = ref({ nom: "", prix: 0, quantity: 0 });

    // USERS
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      console.log("Users:", users.value);
    };

    // PRODUCTS
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log("Products:", products.value);
    };

    const addProduct = async () => {
      await addDoc(collection(db, "products"), { ...newProduct.value });
      newProduct.value = { nom: "", prix: 0, quantity: 0 };
      fetchProducts();
    };

    const deleteProduct = async (id) => {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    };

    // COMMANDES
    const fetchCommandes = async () => {
      const snap = await getDocs(collection(db, "commandes"));
      commandes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      filterCommandes();
      console.log("Commandes:", commandes.value);
    };

    const filterCommandes = () => {
      if (!statusFilter.value) {
        commandesFiltered.value = commandes.value;
      } else {
        commandesFiltered.value = commandes.value.filter(c => c.Statut === statusFilter.value);
      }
    };

    onMounted(() => {
      fetchUsers();
      fetchProducts();
      fetchCommandes();
    });

    return {
      users, products, commandesFiltered, statusFilter, newProduct,
      addProduct, deleteProduct, filterCommandes
    };
  },
  computed: {
    ...mapGetters(["isAdmin"])
  }
};
</script>
