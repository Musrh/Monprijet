<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- Vérification Admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- ================= UTILISATEURS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Utilisateurs</h2>
        <div v-if="users.length === 0">Aucun utilisateur</div>
        <ul>
          <li v-for="user in users" :key="user.uid" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ user.email }} ({{ user.role }})</span>
            <div>
              <button @click="toggleAdmin(user)" class="mr-2 bg-blue-500 text-white px-2 rounded">
                {{ user.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
              </button>
              <button @click="deleteUser(user.uid)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>

        <div v-if="commandes.length === 0">Aucune commande trouvée</div>

        <div v-for="commande in commandes" :key="commande.id" class="border p-4 mb-4 rounded shadow">
          <p><strong>Client :</strong> {{ commande.email }}</p>
          <p><strong>Date :</strong> {{ commande.date?.toDate().toLocaleString() || '' }}</p>
          <p><strong>Devise :</strong> {{ commande.devise }}</p>
          <p><strong>Montant :</strong> {{ commande.montant }} {{ commande.devise }}</p>
          <p><strong>Statut :</strong> {{ commande.statut }}</p>

          <p><strong>Produits :</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="item in commande.items" :key="item.nom">
              {{ item.nom }} x{{ item.Quantity }} - {{ item.prix }} {{ commande.devise }}
            </li>
          </ul>

          <select v-model="commande.statut" @change="updateStatut(commande)" class="mt-2 border p-1 rounded">
            <option>En attente</option>
            <option>Payé</option>
          </select>

          <button @click="deleteCommande(commande.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
            Supprimer
          </button>
        </div>
      </section>

      <!-- ================= PRODUITS ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Produits</h2>

        <form @submit.prevent="addProduct" class="mb-4 flex gap-2 flex-wrap">
          <input v-model="newProduct.nom" placeholder="Nom" class="border p-1 rounded" required />
          <input v-model.number="newProduct.prix" type="number" placeholder="Prix" class="border p-1 rounded" required />
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" class="border p-1 rounded" required />
          <input v-model="newProduct.image" placeholder="Image URL" class="border p-1 rounded" />
          <button type="submit" class="bg-green-500 text-white px-3 rounded">Ajouter</button>
        </form>

        <ul>
          <li v-for="product in products" :key="product.id" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ product.nom }} - {{ product.prix }} € - Stock: {{ product.stock }}</span>
            <div>
              <button @click="editProduct(product)" class="mr-2 bg-yellow-500 text-white px-2 rounded">Modifier</button>
              <button @click="deleteProduct(product.id)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const produits = ref([]);
    const commandes = ref([]);
    const products = ref([]);
    const newProduct = ref({ nom: "", prix: 0, stock: 0, image: "" });

    // 🔹 USERS
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    };
    const toggleAdmin = async (user) => {
      const newRole = user.role === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", user.uid), { role: newRole });
      fetchUsers();
    };
    const deleteUser = async (uid) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        await deleteDoc(doc(db, "users", uid));
        fetchUsers();
      }
    };

    // 🔹 COMMANDES
    const fetchCommandes = async () => {
      const snap = await getDocs(collection(db, "commandes"));
      commandes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };
    const updateStatut = async (commande) => {
      await updateDoc(doc(db, "commandes", commande.id), { statut: commande.statut });
    };
    const deleteCommande = async (id) => {
      if (confirm("Supprimer cette commande ?")) {
        await deleteDoc(doc(db, "commandes", id));
        fetchCommandes();
      }
    };

    // 🔹 PRODUCTS
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };
    const addProduct = async () => {
      if (!newProduct.value.nom || !newProduct.value.prix) return;
      await addDoc(collection(db, "products"), { ...newProduct.value });
      newProduct.value = { nom: "", prix: 0, stock: 0, image: "" };
      fetchProducts();
    };
    const editProduct = async (product) => {
      const newName = prompt("Nom du produit :", product.nom);
      const newPrice = prompt("Prix
