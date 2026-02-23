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
          <li
            v-for="user in users"
            :key="user.id"
            class="border p-2 mb-2 flex justify-between items-center rounded"
          >
            <span>{{ user.email }} ({{ user.rôle }})</span>
            <div>
              <button
                @click="toggleAdmin(user)"
                class="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
              >
                {{ user.rôle === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
              </button>
              <button
                @click="deleteUser(user.id)"
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
          <input v-model="productForm.nom" placeholder="Nom" required class="border p-1 rounded" />
          <input v-model.number="productForm.prix" type="number" placeholder="Prix" required class="border p-1 rounded" />
          <input v-model.number="productForm.Quantity" type="number" placeholder="Quantité" required class="border p-1 rounded" />
          <input v-model="productForm.image" placeholder="Image URL" class="border p-1 rounded" />
          <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded">
            {{ productForm.id ? "Modifier" : "Ajouter" }}
          </button>
          <button v-if="productForm.id" type="button" @click="resetProductForm" class="bg-gray-500 text-white px-3 py-1 rounded">
            Annuler
          </button>
        </form>

        <ul>
          <li v-for="prod in products" :key="prod.id" class="border p-2 mb-2 flex justify-between items-center rounded">
            <span>{{ prod.nom }} - {{ prod.prix }} € - Quantité: {{ prod.Quantity }}</span>
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

        <div class="mb-2">
          <label>Filtrer par statut:</label>
          <select v-model="filterStatus" @change="fetchCommandes" class="border p-1 rounded ml-2">
            <option value="">Tous</option>
            <option value="en attente">En attente</option>
            <option value="payé">Payé</option>
          </select>
        </div>

        <div v-if="commandes.length === 0">Aucune commande trouvée</div>

        <div v-for="commande in commandes" :key="commande.id" class="border p-3 mb-3 rounded shadow">
          <p><strong>Client:</strong> {{ commande.email }}</p>
          <p><strong>Montant:</strong> {{ commande.montant }} {{ commande.devise }}</p>
          <p><strong>Status:</strong>
            <select v-model="commande.Statut" @change="updateCommandeStatus(commande)" class="border p-1 rounded">
              <option>en attente</option>
              <option>payé</option>
            </select>
          </p>
          <p><strong>Items:</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="(item, idx) in commande.items" :key="idx">
              {{ item.nom }} x{{ item.Quantity }} - {{ item.prix }} €
            </li>
          </ul>
          <button @click="deleteCommande(commande.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">Supprimer</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const products = ref([]);
    const commandes = ref([]);
    const filterStatus = ref("");
    const productForm = ref({ id: null, nom: "", prix: 0, Quantity: 0, image: "" });

    // --- USERS ---
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const toggleAdmin = async (user) => {
      await updateDoc(doc(db, "users", user.id), { rôle: user.rôle === "admin" ? "user" : "admin" });
      fetchUsers();
    };

    const deleteUser = async (id) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        await deleteDoc(doc(db, "users", id));
        fetchUsers();
      }
    };

    // --- PRODUCTS ---
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const addOrUpdateProduct = async () => {
      if (!productForm.value.nom) return;
      if (productForm.value.id) {
        await updateDoc(doc(db, "products", productForm.value.id), {
          nom: productForm.value.nom,
          prix: productForm.value.prix,
          Quantity: productForm.value.Quantity,
          image: productForm.value.image
        });
      } else {
        await addDoc(collection(db, "products"), { ...productForm.value });
      }
      productForm.value = { id: null, nom: "", prix: 0, Quantity: 0, image: "" };
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
      productForm.value = { id: null, nom: "", prix: 0, Quantity: 0, image: "" };
    };

    // --- COMMANDES ---
    const fetchCommandes = async () => {
      const snap = await getDocs(collection(db, "commandes"));
      let allCommandes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (filterStatus.value) {
        allCommandes = allCommandes.filter(c => c.Statut.toLowerCase() === filterStatus.value.toLowerCase());
      }
      commandes.value = allCommandes;
    };

    const updateCommandeStatus = async (commande) => {
      await updateDoc(doc(db, "commandes", commande.id), { Statut: commande.Statut });
      fetchCommandes();
    };

    const deleteCommande = async (id) => {
      if (confirm("Supprimer cette commande ?")) {
        await deleteDoc(doc(db, "commandes", id));
        fetchCommandes();
      }
    };

    onMounted(() => {
      fetchUsers();
      fetchProducts();
      fetchCommandes();
    });

    return {
      users,
      products,
      commandes,
      productForm,
      filterStatus,
      toggleAdmin,
      deleteUser,
      addOrUpdateProduct,
      editProduct,
      deleteProduct,
      resetProductForm,
      fetchCommandes,
      updateCommandeStatus,
      deleteCommande
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
