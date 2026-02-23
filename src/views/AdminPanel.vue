<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- ================= UTILISATEURS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Utilisateurs</h2>
        <div v-if="users.length === 0">Aucun utilisateur</div>

        <ul>
          <li v-for="user in users" :key="user.uid" class="border p-2 mb-2 flex justify-between items-center rounded">
            <span>{{ user.email }} ({{ user.role }})</span>
            <div>
              <button
                @click="toggleAdmin(user)"
                class="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
              >
                {{ user.role === "admin" ? "Retirer Admin" : "Rendre Admin" }}
              </button>
              <button
                @click="deleteUser(user.uid)"
                class="bg-red-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= PRODUITS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Produits</h2>

        <form @submit.prevent="addOrUpdateProduct" class="mb-4 flex gap-2 flex-wrap">
          <input v-model="productForm.name" placeholder="Nom" required />
          <input v-model.number="productForm.price" type="number" placeholder="Prix" required />
          <input v-model.number="productForm.stock" type="number" placeholder="Stock" required />
          <input v-model="productForm.description" placeholder="Description" required />
          <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded">
            {{ productForm.id ? "Modifier" : "Ajouter" }}
          </button>
          <button type="button" v-if="productForm.id" @click="resetProductForm" class="bg-gray-500 text-white px-3 py-1 rounded">
            Annuler
          </button>
        </form>

        <ul>
          <li v-for="prod in products" :key="prod.id" class="border p-2 mb-2 flex justify-between items-center rounded">
            <span>{{ prod.name }} - {{ prod.price }} € - Stock: {{ prod.stock }}</span>
            <div>
              <button @click="editProduct(prod)" class="mr-2 bg-yellow-500 text-white px-2 py-1 rounded">Modifier</button>
              <button @click="deleteProduct(prod.id)" class="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>

        <div>
          <label>Filtrer par status:</label>
          <select v-model="filterStatus" @change="fetchOrders">
            <option value="">Tous</option>
            <option value="en attente">En attente</option>
            <option value="payée">Payée</option>
          </select>
        </div>

        <div v-if="orders.length === 0" class="mt-2">
          Aucune commande trouvée
        </div>

        <div v-for="order in orders" :key="order.id" class="border p-3 mb-3 rounded shadow">
          <p><strong>Client:</strong> {{ order.userEmail }}</p>
          <p><strong>Total:</strong> {{ order.total }} €</p>
          <p><strong>Status:</strong>
            <select v-model="order.status" @change="updateOrderStatus(order)">
              <option>en attente</option>
              <option>payée</option>
              <option>expédiée</option>
              <option>livrée</option>
              <option>annulée</option>
            </select>
          </p>
          <p><strong>Produits:</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="(p, idx) in order.products" :key="idx">{{ p.name }} x{{ p.quantity }}</li>
          </ul>
          <button @click="deleteOrder(order.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">Supprimer</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc
} from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const products = ref([]);
    const orders = ref([]);
    const filterStatus = ref("");
    const productForm = ref({ id: null, name: "", price: 0, stock: 0, description: "" });

    // --- USERS ---
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    };

    const toggleAdmin = async (user) => {
      await updateDoc(doc(db, "users", user.uid), { role: user.role === "admin" ? "user" : "admin" });
      fetchUsers();
    };

    const deleteUser = async (uid) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        await deleteDoc(doc(db, "users", uid));
        fetchUsers();
      }
    };

    // --- PRODUCTS ---
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const addOrUpdateProduct = async () => {
      if (productForm.value.id) {
        // update
        await updateDoc(doc(db, "products", productForm.value.id), {
          name: productForm.value.name,
          price: productForm.value.price,
          stock: productForm.value.stock,
          description: productForm.value.description
        });
      } else {
        // add
        await addDoc(collection(db, "products"), { ...productForm.value });
      }
      productForm.value = { id: null, name: "", price: 0, stock: 0, description: "" };
      fetchProducts();
    };

    const editProduct = (prod) => {
      productForm.value = { ...prod };
    };

    const deleteProduct = async (id) => {
      if (confirm("Supprimer ce produit ?")) {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
      }
    };

    const resetProductForm = () => {
      productForm.value = { id: null, name: "", price: 0, stock: 0, description: "" };
    };

    // --- COMMANDES ---
    const fetchOrders = async () => {
      let snap = await getDocs(collection(db, "commandes"));
      let allOrders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (filterStatus.value) {
        allOrders = allOrders.filter(o => o.status.toLowerCase() === filterStatus.value.toLowerCase());
      }
      orders.value = allOrders;
    };

    const updateOrderStatus = async (order) => {
      await updateDoc(doc(db, "commandes", order.id), { status: order.status });
      fetchOrders();
    };

    const deleteOrder = async (id) => {
      if (confirm("Supprimer cette commande ?")) {
        await deleteDoc(doc(db, "commandes", id));
        fetchOrders();
      }
    };

    onMounted(() => {
      fetchUsers();
      fetchProducts();
      fetchOrders();
    });

    return {
      users,
      products,
      orders,
      productForm,
      filterStatus,
      toggleAdmin,
      deleteUser,
      addOrUpdateProduct,
      editProduct,
      deleteProduct,
      resetProductForm,
      fetchOrders,
      updateOrderStatus,
      deleteOrder
    };
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
