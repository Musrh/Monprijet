<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-2xl font-bold mb-4">Uploader un produit (Admin)</h2>

    <div v-if="!isAdmin" class="text-red-500">
      Vous n’êtes pas autorisé à voir cette page.
    </div>

    <div v-else>
      <!-- Formulaire ajout produit -->
      <div class="mb-6 border p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Ajouter un produit</h3>

        <input v-model="nom" placeholder="Nom du produit" class="border p-2 mb-2 w-full"/>
        <input v-model.number="prix" type="number" placeholder="Prix (€)" class="border p-2 mb-2 w-full"/>
        <input type="file" @change="handleFile" class="mb-2"/>
        
        <button @click="uploadProduit" 
                class="bg-green-500 text-white px-4 py-2 rounded"
                :disabled="!file || !nom || !prix">
          Ajouter produit
        </button>

        <div v-if="imageUrl" class="mt-4">
          <p>Image uploadée :</p>
          <img :src="imageUrl" class="w-48 mt-2 rounded shadow"/>
        </div>

        <div v-if="responseData" class="mt-4 p-2 border bg-gray-100">
          <h3 class="font-semibold mb-2">Réponse Cloudinary + Firestore</h3>
          <pre>{{ responseData }}</pre>
        </div>
      </div>

      <!-- Liste des produits existants -->
      <div>
        <h3 class="font-semibold mb-2">Produits existants</h3>
        <div v-if="loading" class="text-gray-600">Chargement des produits...</div>
        <div v-else-if="produits.length === 0" class="text-gray-600">Aucun produit trouvé.</div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="p in produits" :key="p.id" class="border p-2 rounded shadow flex flex-col items-center">
            <img :src="p.image" class="w-32 h-32 object-cover mb-2 rounded"/>
            <p class="font-semibold">{{ p.nom }}</p>
            <p>{{ p.prix }} €</p>
            <button @click="supprimerProduit(p.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mt-2">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useStore } from 'vuex';

// -------------------
// Firebase setup
// -------------------
const auth = getAuth();
const db = getFirestore();

// -------------------
// Vuex
// -------------------
const store = useStore();
const isAdmin = computed(() => store.getters.isAdmin);

// -------------------
// Refs
// -------------------
const nom = ref('');
const prix = ref(null);
const file = ref(null);
const imageUrl = ref('');
const produits = ref([]);
const loading = ref(true);
const responseData = ref(null);

// -------------------
// Fichier sélectionné
// -------------------
const handleFile = (e) => {
  file.value = e.target.files[0];
};

// -------------------
// Upload produit
// -------------------
const uploadProduit = async () => {
  if (!auth.currentUser) {
    alert("Vous devez être connecté pour ajouter un produit");
    return;
  }

  if (!file.value || !nom.value || !prix.value) {
    alert("Remplissez tous les champs et sélectionnez une image");
    return;
  }

  try {
    // 🔹 Upload Cloudinary
    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("upload_preset", "VueFirebase"); // ton preset Cloudinary

    const cloudRes = await fetch(
      "https://api.cloudinary.com/v1_1/dla18l69k/image/upload",
      { method: "POST", body: formData }
    );
    const cloudData = await cloudRes.json();

    if (!cloudData.secure_url) {
      alert("Erreur lors de l'upload sur Cloudinary");
      return;
    }
    imageUrl.value = cloudData.secure_url;

    // 🔹 Stockage Firestore
    const docRef = await addDoc(collection(db, "products"), {
      nom: nom.value,
      prix: prix.value,
      image: imageUrl.value,
      createdBy: auth.currentUser.uid,
      createdAt: new Date()
    });

    responseData.value = { cloudinary: cloudData, firestoreId: docRef.id };

    // Mise à jour locale
    produits.value.push({ id: docRef.id, nom: nom.value, prix: prix.value, image: imageUrl.value });

    // Reset formulaire
    nom.value = '';
    prix.value = null;
    file.value = null;
    imageUrl.value = '';

    alert("Produit ajouté avec succès !");
  } catch (err) {
    console.error("Erreur Cloudinary ou Firestore :", err);
    alert("Erreur lors de l'upload : " + err.message);
  }
};

// -------------------
// Charger produits existants
// -------------------
const fetchProduits = async () => {
  loading.value = true;
  const snapshot = await getDocs(collection(db, "products"));
  produits.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  loading.value = false;
};

// -------------------
// Supprimer produit
// -------------------
const supprimerProduit = async (id) => {
  if (!confirm("Supprimer ce produit ?")) return;
  await deleteDoc(doc(db, "products", id));
  produits.value = produits.value.filter(p => p.id !== id);
};

// -------------------
// Initialisation
// -------------------
onMounted(() => {
  if (isAdmin.value) fetchProduits();
});
</script>
