<template>
  <div v-if="loading">
    <p>Chargement du panneau admin...</p>
  </div>

  <div v-else>
    <div v-if="isAdmin" class="admin-panel p-4">
      <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>

      <!-- Section Commandes -->
      <section class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Commandes des utilisateurs</h2>
        <div v-if="orders.length === 0">Aucune commande</div>
        <ul>
          <li v-for="order in orders" :key="order.id" class="mb-2 border p-2 rounded">
            <strong>Utilisateur:</strong> {{ order.userEmail }} |
            <strong>Produits:</strong> {{ order.products.map(p => p.name + ' x' + p.quantity).join(', ') }} |
            <strong>Status:</strong> {{ order.status }}
          </li>
        </ul>
      </section>

      <!-- Section Utilisateurs -->
      <section class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Utilisateurs</h2>
        <div v-if="users.length === 0">Aucun utilisateur</div>
        <ul>
          <li v-for="userItem in users" :key="userItem.uid" class="mb-2 border p-2 rounded flex justify-between items-center">
            <span>{{ userItem.email }} ({{ userItem.role }})</span>
            <div>
              <button @click="editUser(userItem)" class="mr-2 bg-blue-500 text-white px-2 rounded">Modifier</button>
              <button @click="deleteUser(userItem.uid)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Section Produits -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Produits</h2>
        <form @submit.prevent="addProduct" class="mb-4">
          <input v-model="newProduct.name" placeholder="Nom" class="border p-1 mr-2" required />
          <input v-model.number="newProduct.price" type="number" placeholder="Prix" class="border p-1 mr-2" required />
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" class="border p-1 mr-2" required />
          <input v-model="newProduct.description" placeholder="Description" class="border p-1 mr-2" required />
          <button type="submit" class="bg-green-500 text-white px-2 rounded">Ajouter Produit</button>
        </form>

        <ul>
          <li v-for="product in products" :key="product.id" class="mb-2 border p-2 rounded flex justify-between items-center">
            <span>{{ product.name }} - ${{ product.price }} - Stock: {{ product.stock }}</span>
            <button @click="deleteProduct(product.id)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
          </li>
        </ul>
      </section>
    </div>

    <div v-else>
      <p>Vous n'êtes pas admin.</p>
    </div>

    <!-- Debug (optionnel) -->
    <p class="mt-4 text-sm text-gray-500">
      Utilisateur connecté: {{ user?.email }} | Role: {{ user?.role }} | isAdmin: {{ isAdmin }}
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';

export default {
  setup() {
    const loading = ref(true);
    const user = ref(null);
    const isAdmin = ref(false);
    const users = ref([]);
    const orders = ref([]);
    const products = ref([]);
    const newProduct = ref({
      name: '',
      price: 0,
      stock: 0,
      description: ''
    });

    // Récupérer les utilisateurs
    const fetchUsers = async () => {
      const querySnap = await getDocs(collection(db, 'users'));
      users.value = querySnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    };

    // Récupérer les commandes
    const fetchOrders = async () => {
      const querySnap = await getDocs(collection(db, 'orders'));
      orders.value = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Récupérer les produits
    const fetchProducts = async () => {
      const querySnap = await getDocs(collection(db, 'products'));
      products.value = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Ajouter un produit
    const addProduct = async () => {
      await addDoc(collection(db, 'products'), { ...newProduct.value });
      newProduct.value = { name: '', price: 0, stock: 0, description: '' };
      fetchProducts();
    };

    // Supprimer un utilisateur
    const deleteUser = async (uid) => {
      if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
        await deleteDoc(doc(db, 'users', uid));
        fetchUsers();
      }
    };

    // Supprimer un produit
    const deleteProduct = async (id) => {
      if (confirm
