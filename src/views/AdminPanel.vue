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
          <li v-for="user in users" :key="user.uid" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ user.email }} ({{ user.role }})</span>
            <div>
              <button @click="toggleAdmin(user)" class="mr-2 bg-blue-500 text-white px-2 rounded">
                {{ user.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
              </button>
              <button @click="deleteUser(user.uid)" class="bg-red-500 text-white px-2 rounded">
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
          <input v-model="productForm.nom" placeholder="Nom" class="border p-1 rounded" required />
          <input v-model.number="productForm.prix" type="number" placeholder="Prix" class="border p-1 rounded" required />
          <input v-model.number="productForm.quantity" type="number" placeholder="Stock" class="border p-1 rounded" required />
          <input v-model="productForm.image" placeholder="Image URL" class="border p-1 rounded" />
          <button type="submit" class="bg-green-500 text-white px-3 rounded">
            {{ productForm.id ? "Modifier" : "Ajouter" }}
          </button>
          <button v-if="productForm.id" type="button" @click="resetProductForm" class="bg-gray-500 text-white px-3 rounded">
            Annuler
          </button>
        </form>

        <ul>
          <li v-for="prod in products" :key="prod.id" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ prod.nom }} - {{ prod.prix }} € - Stock: {{ prod.quantity }}</span>
            <div>
              <button @click="editProduct(prod)" class="mr-2 bg-yellow-500 text-white px-2 rounded">Modifier</button>
              <button @click="deleteProduct(prod.id)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>
        <div>
          <label>Filtrer par statut: </label>
          <select v-model="statusFilter" @change="filterCommandes">
            <option value="">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Payé">Payé</option>
          </select>
        </div>

        <div v-if="commandesFiltered.length === 0" class="mt-2">
          Aucune commande trouvée
        </div>

        <div v-for="commande in commandesFiltered" :key="commande.id" class="border p-4 mb-4 rounded shadow">
          <p><strong>Client :</strong> {{ commande.email }}</p>
          <p><strong>Date :</strong> {{ commande.date }}</p>
          <p><strong>Devise :</strong> {{ commande.devise }}</p>

          <p><strong>Items :</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="(item, idx) in commande.items" :key="idx">
              {{ item.nom }} x{{ item.Quantity }} - {{ item.prix }} € - Montant: {{ item.montant }}
            </li>
          </ul>

          <p class="mt-2">
            <strong>Status :</strong>
            <select v-model="commande.Statut" @change="updateStatut(commande)">
              <option>En attente</option>
              <option>Payé</option>
            </select>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const products = ref([]);
    const commandes = ref([]);
    const commandesFiltered = ref([]);
    const statusFilter = ref("");

    const productForm = ref({
      id: null,
      nom: "",
      prix: 0,
      quantity: 0,
      image: ""
    });

    // 🔹 USERS
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

    // 🔹 PRODUCTS
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const addOrUpdateProduct = async () => {
      if (!productForm.value.nom) return;
      if (productForm.value.id) {
        // Modifier
        await updateDoc(doc(db, "products", productForm.value.id), { 
          nom: productForm.value.nom,
          prix: productForm.value.prix,
          quantity: productForm.value.quantity,
          image: productForm.value.image
        });
      } else {
        // Ajouter
        await addDoc(collection(db, "products"), {
          nom: productForm.value.nom,
          prix: productForm.value.prix,
          quantity: productForm.value.quantity,
          image: productForm.value.image
        });
      }
      resetProductForm();
      fetchProducts();
    };

    const editProduct = (prod) => {
      productForm.value = { ...prod };
    };

    const resetProductForm = () => {
      productForm.value = { id: null, nom: "", prix: 0, quantity: 0, image: "" };
    };

    const deleteProduct = async (id) => {
      if (confirm("Supprimer ce produit ?")) {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
      }
    };

    // 🔹 COMMANDES
    const fetchCommandes = async () => {
      const snap = await getDocs(collection(db, "commandes"));
      commandes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      filterCommandes();
    };

    const filterCommandes = () => {
      if (!statusFilter.value) {
        commandesFiltered.value = commandes.value;
      } else {
        commandesFiltered.value = commandes.value.filter(c => c.Statut === statusFilter.value);
      }
    };

    const updateStatut = async (commande) => {
      await updateDoc(doc(db, "commandes", commande.id), { Statut: commande.Statut });
      fetchCommandes();
    };

    onMounted(() => {
      fetchUsers();
      fetchProducts();
      fetchCommandes();
    });

    return {
      users, products, commandes, commandesFiltered, statusFilter, productForm,
      toggleAdmin, deleteUser, addOrUpdateProduct, editProduct, resetProductForm, deleteProduct, filterCommandes, updateStatut
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
