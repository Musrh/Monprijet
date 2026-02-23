<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- Utilisateurs -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Utilisateurs</h2>
        <div v-if="users.length === 0">Aucun utilisateur</div>
        <ul>
          <li v-for="userItem in users" :key="userItem.uid" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ userItem.email }} ({{ userItem.role }})</span>
            <div>
              <button @click="toggleAdmin(userItem)" class="mr-2 bg-blue-500 text-white px-2 rounded">
                {{ userItem.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
              </button>
              <button @click="deleteUser(userItem.uid)" class="bg-red-500 text-white px-2 rounded">
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Commandes -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>
        <div v-if="commandes.length === 0">Aucune commande trouvée</div>
        <div v-for="commande in commandes" :key="commande.id" class="border p-4 mb-4 rounded shadow">
          <p><strong>Client :</strong> {{ commande.userEmail }}</p>
          <p><strong>Total :</strong> {{ commande.total }} €</p>
          <p><strong>Produits :</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="(product, idx) in commande.products" :key="idx">
              {{ product.name }} x{{ product.quantity }}
            </li>
          </ul>
          <p class="mt-2">
            <strong>Status :</strong>
            <select v-model="commande.status" @change="updateStatus(commande)">
              <option>En attente</option>
              <option>Payée</option>
              <option>Expédiée</option>
              <option>Livrée</option>
              <option>Annulée</option>
            </select>
          </p>
          <button @click="deleteCommande(commande.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
            Supprimer
          </button>
        </div>
      </section>

      <!-- Produits -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Produits</h2>
        <form @submit.prevent="addProduct" class="mb-4 flex gap-2 flex-wrap">
          <input v-model="newProduct.name" placeholder="Nom" class="border p-1 rounded" required />
          <input v-model.number="newProduct.price" type="number" placeholder="Prix" class="border p-1 rounded" required />
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" class="border p-1 rounded" required />
          <input v-model="newProduct.description" placeholder="Description" class="border p-1 rounded" required />
          <button type="submit" class="bg-green-500 text-white px-3 rounded">Ajouter</button>
        </form>
        <ul>
          <li v-for="product in products" :key="product.id" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ product.name }} - {{ product.price }} € - Stock: {{ product.stock }}</span>
            <button @click="deleteProduct(product.id)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const commandes = ref([]);
    const products = ref([]);
    const newProduct = ref({ name: "", price: 0, stock: 0, description: "" });

    // 🔹 Utilisateurs
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    };
    const toggleAdmin = async (userItem) => {
      const newRole = userItem.role === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", userItem.uid), { role: newRole });
      fetchUsers();
    };
    const deleteUser = async (uid) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        await deleteDoc(doc(db, "users", uid));
        fetchUsers();
      }
    };

    // 🔹 Commandes
    const fetchCommandes = async () => {
      const snap = await getDocs(collection(db, "commandes"));
      commandes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };
    const updateStatus = async (commande) => {
      await updateDoc(doc(db, "commandes", commande.id), { status: commande.status });
    };
    const deleteCommande = async (id) => {
      if (confirm("Supprimer cette commande ?")) {
        await deleteDoc(doc(db, "commandes", id));
        fetchCommandes();
      }
    };

    // 🔹 Produits
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };
    const addProduct = async () => {
      await addDoc(collection(db, "products"), { ...newProduct.value });
      newProduct.value = { name: "", price: 0, stock: 0, description: "" };
      fetchProducts();
    };
    const deleteProduct = async (id) => {
      if (confirm("Supprimer ce produit ?")) {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
      }
    };

    onMounted(() => {
      fetchUsers();
      fetchCommandes();
      fetchProducts();
    });

    return { users, commandes, products, newProduct, toggleAdmin, deleteUser, updateStatus, deleteCommande, addProduct, deleteProduct };
  },
  computed: {
    ...mapGetters(["isAdmin"])
  }
};
</script>

<style scoped>
button:hover { opacity: 0.8; cursor: pointer; }
section { margin-bottom: 40px; }
</style>
