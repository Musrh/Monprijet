<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- 🔹 Vérification admin -->
    <div v-if="loading">
      <p>Chargement du panneau admin...</p>
    </div>

    <div v-else-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- ================= UTILISATEURS ================= -->
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

      <!-- ================= COMMANDES ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>
        <div v-if="orders.length === 0">Aucune commande trouvée</div>
        <div v-for="order in orders" :key="order.id" class="border p-4 mb-4 rounded shadow">
          <p><strong>Client :</strong> {{ order.userEmail }}</p>
          <p><strong>Total :</strong> {{ order.total }} €</p>
          <p><strong>Produits :</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="(product, idx) in order.products" :key="idx">
              {{ product.name }} x{{ product.quantity }}
            </li>
          </ul>
          <p class="mt-2">
            <strong>Status :</strong>
            <select v-model="order.status" @change="updateStatus(order)">
              <option>En attente</option>
              <option>Payée</option>
              <option>Expédiée</option>
              <option>Livrée</option>
              <option>Annulée</option>
            </select>
          </p>
          <button @click="deleteOrder(order.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
            Supprimer
          </button>
        </div>
      </section>

      <!-- ================= PRODUITS ================= -->
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
import { ref, onMounted, computed } from "vue"
import { db } from "@/firebase"
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const loading = ref(true)
    const users = ref([])
    const orders = ref([])
    const products = ref([])
    const newProduct = ref({ name: "", price: 0, stock: 0, description: "" })

    const isAdmin = computed(() => store.getters.isAdmin)

    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"))
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
    }
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"))
      orders.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"))
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    const toggleAdmin = async (userItem) => {
      await updateDoc(doc(db, "users", userItem.uid), { role: userItem.role === 'admin' ? 'user' : 'admin' })
      fetchUsers()
    }
    const deleteUser = async (uid) => { if (confirm("Supprimer cet utilisateur ?")) { await deleteDoc(doc(db, "users", uid)); fetchUsers() } }

    const updateStatus = async (order) => { await updateDoc(doc(db, "orders", order.id), { status: order.status }) }
    const deleteOrder = async (id) => { if (confirm("Supprimer cette commande ?")) { await deleteDoc(doc(db, "orders", id)); fetchOrders() } }

    const addProduct = async () => { await addDoc(collection(db, "products"), { ...newProduct.value }); newProduct.value = { name: "", price: 0, stock: 0, description: "" }; fetchProducts() }
    const deleteProduct = async (id) => { if (confirm("Supprimer ce produit ?")) { await deleteDoc(doc(db, "products", id)); fetchProducts() } }

    onMounted(async () => {
      await Promise.all([fetchUsers(), fetchOrders(), fetchProducts()])
      loading.value = false
    })

    return { loading, users, orders, products, newProduct, isAdmin, toggleAdmin, deleteUser, updateStatus, deleteOrder, addProduct, deleteProduct }
  }
}
</script>

<style scoped>
button:hover { opacity: 0.8; cursor: pointer; }
section { margin-bottom: 40px; }
</style>
