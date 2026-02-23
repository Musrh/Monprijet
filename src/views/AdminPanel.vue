<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- 🔹 Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- ================= UTILISATEURS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Utilisateurs</h2>
        <div v-if="users.length === 0">Aucun utilisateur trouvé</div>
        <ul>
          <li
            v-for="user in users"
            :key="user.uid"
            class="mb-2 flex justify-between items-center border p-2 rounded"
          >
            <span>{{ user.email }} - {{ user.role }}</span>
            <div>
              <button
                @click="toggleAdmin(user)"
                class="mr-2 bg-blue-500 text-white px-2 rounded"
              >
                {{ user.role === "admin" ? "Retirer Admin" : "Rendre Admin" }}
              </button>
              <button
                @click="deleteUser(user.uid)"
                class="bg-red-500 text-white px-2 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= PRODUITS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Produits</h2>

        <form @submit.prevent="addProduct" class="mb-4 flex gap-2 flex-wrap">
          <input
            v-model="newProduct.nom"
            placeholder="Nom"
            class="border p-1 rounded"
            required
          />
          <input
            v-model.number="newProduct.prix"
            type="number"
            placeholder="Prix"
            class="border p-1 rounded"
            required
          />
          <input
            v-model.number="newProduct.Quantity"
            type="number"
            placeholder="Stock"
            class="border p-1 rounded"
            required
          />
          <input
            v-model="newProduct.image"
            placeholder="Image URL"
            class="border p-1 rounded"
          />
          <button type="submit" class="bg-green-500 text-white px-3 rounded">
            Ajouter
          </button>
        </form>

        <ul>
          <li
            v-for="prod in products"
            :key="prod.id"
            class="mb-2 flex justify-between items-center border p-2 rounded"
          >
            <span>{{ prod.nom }} - {{ prod.prix }} € - Stock: {{ prod.Quantity }}</span>
            <div>
              <button
                @click="editProduct(prod)"
                class="mr-2 bg-yellow-500 text-white px-2 rounded"
              >
                Modifier
              </button>
              <button
                @click="deleteProduct(prod.id)"
                class="bg-red-500 text-white px-2 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Commandes</h2>

        <div class="mb-4">
          Filtrer par statut:
          <select v-model="filterStatus" @change="filterOrders">
            <option value="Tous">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Payé">Payé</option>
          </select>
        </div>

        <div v-if="filteredOrders.length === 0">Aucune commande trouvée</div>

        <div
          v-for="cmd in filteredOrders"
          :key="cmd.id"
          class="border p-4 mb-4 rounded shadow"
        >
          <p><strong>Client:</strong> {{ cmd.email }}</p>
          <p><strong>Date:</strong> {{ cmd.date }}</p>
          <p><strong>Devise:</strong> {{ cmd.devise }}</p>
          <p><strong>Montant:</strong> {{ cmd.montant }}</p>
          <p><strong>Status:</strong> {{ cmd.Statut }}</p>

          <p><strong>Items:</strong></p>
          <ul class="ml-4 list-disc">
            <li
              v-for="item in cmd.items"
              :key="item.nom"
            >
              {{ item.nom }} x{{ item.Quantity }} - {{ item.prix }} €
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);
    const products = ref([]);
    const commandes = ref([]);
    const filteredOrders = ref([]);
    const filterStatus = ref("Tous");

    const newProduct = ref({
      nom: "",
      prix: 0,
      Quantity: 0,
      image: ""
    });

    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    };

    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const fetchCommandes = async () => {
      const snap = await getDocs(collection(db, "commandes"));
      commandes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      filteredOrders.value = commandes.value;
    };

    const filterOrders = () => {
      if (filterStatus.value === "Tous") {
        filteredOrders.value = commandes.value;
      } else {
        filteredOrders.value = commandes.value.filter(c => c.Statut === filterStatus.value);
      }
    };

    // 🔹 Utilisateurs
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

    // 🔹
