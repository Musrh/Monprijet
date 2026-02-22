<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- 🔹 Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- Section Utilisateurs -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Utilisateurs</h2>
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

      <!-- Section Commandes -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Commandes</h2>
        <div v-if="orders.length === 0">Aucune commande</div>
        <ul>
          <li v-for="order in orders" :key="order.id" class="mb-2 border p-2 rounded">
            <strong>Utilisateur:</strong> {{ order.userEmail }} |
            <strong>Produits:</strong> {{ order.products.map(p => p.name + ' x' + p.quantity).join(', ') }} |
            <strong>Status:</strong> {{ order.status }}
          </li>
        </ul>
      </section>

      <!-- Section Produits -->
      <section>
        <h2 class="text-2xl font-semibold mb-2">Produits</h2>

        <form @submit.prevent="addProduct" class="mb-4 flex gap-2 flex-wrap">
          <input v-model="newProduct.name" placeholder="Nom" class="border p-1 rounded" required />
          <input v-model.number="newProduct.price" type="number" placeholder="Prix" class="border p-1 rounded" required />
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" class="border p-1 rounded" required />
          <input v-model="newProduct.description" placeholder="Description" class="border p-1 rounded" required />
          <button type="submit" class="bg-green-500 text-white px-3 rounded">Ajouter</button>
        </form>

        <ul>
          <li v-for="product in products" :key="product.id" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ product.name }} - ${{ product.price }} - Stock: {{ product.stock }}</span>
            <button @click="deleteProduct(product.id)" class="bg-red-500 text-white px-2 rounded">
              Supprimer
            </button>
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
    const orders = ref([]);
    const products = ref([]);
    const newProduct = ref({ name: "", price: 0, stock: 0, description: "" });

    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    };

    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      orders.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const deleteUser = async (uid) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        await deleteDoc(doc(db, "users", uid));
        fetchUsers();
      }
    };

    const toggleAdmin = async (userItem) => {
      const newRole = userItem.role === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", userItem.uid), { role: newRole });
      fetchUsers();
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
      fetchOrders();
      fetchProducts();
    });

    return { users, orders, products, newProduct, deleteUser, toggleAdmin, addProduct, deleteProduct };
  },

  computed: {
    ...mapGetters(["isAdmin"])
  }
};
</script>

<style scoped>
h1, h2 {
  color: #1a202c;
}
button:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
