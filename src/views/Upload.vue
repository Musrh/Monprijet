<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">
      {{ editMode ? "Modifier le produit" : "Ajouter un produit" }}
    </h2>

    <div class="mb-2">
      <label class="block font-medium">Nom du produit</label>
      <input v-model="nom" type="text" class="border p-2 w-full" />
    </div>

    <div class="mb-2">
      <label class="block font-medium">Prix (€)</label>
      <input v-model.number="prix" type="number" class="border p-2 w-full" />
    </div>

    <div class="mb-2">
      <label class="block font-medium">Description</label>
      <textarea v-model="description" class="border p-2 w-full" rows="3"></textarea>
    </div>

    <div class="mb-2">
      <label class="block font-medium">Images</label>
      <input type="file" @change="handleFiles" multiple />
    </div>

    <div class="flex gap-2 flex-wrap mb-4">
      <div v-for="(img, i) in images" :key="i" class="w-32 h-32 relative">
        <img :src="img" class="w-full h-full object-cover rounded" />
      </div>
    </div>

    <button
      @click="saveProduit"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      {{ editMode ? "Enregistrer les modifications" : "Ajouter le produit" }}
    </button>

    <div v-if="loading" class="mt-4 text-gray-600">Traitement en cours...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

const route = useRoute();
const router = useRouter();

const nom = ref("");
const prix = ref(0);
const description = ref("");
const images = ref([]);
const files = ref([]);
const editMode = ref(false);
const productId = ref(null);
const loading = ref(false);

// -------------------
// Gestion fichiers
// -------------------
const handleFiles = (e) => {
  files.value = Array.from(e.target.files);
};

// -------------------
// Charger produit en mode édition
// -------------------
onMounted(async () => {
  if (route.params.id) {
    editMode.value = true;
    productId.value = route.params.id;
    const snap = await getDoc(doc(db, "products", productId.value));
    if (snap.exists()) {
      const data = snap.data();
      nom.value = data.nom;
      prix.value = data.prix;
      description.value = data.description;
      images.value = data.images || [];
    }
  }
});

// -------------------
// Upload vers Cloudinary
// -------------------
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "VueFirebase"); // ton preset Cloudinary

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dla18l69k/image/upload",
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error("Erreur Cloudinary");
  return data.secure_url;
};

// -------------------
// Ajouter ou modifier produit
// -------------------
const saveProduit = async () => {
  if (!nom.value || !prix.value) {
    alert("Nom et prix obligatoires");
    return;
  }

  if (!auth.currentUser) {
    alert("Vous devez être connecté pour effectuer cette action");
    return;
  }

  loading.value = true;

  try {
    // Upload des nouvelles images
    const uploadedUrls = [];
    for (const f of files.value) {
      const url = await uploadToCloudinary(f);
      uploadedUrls.push(url);
    }

    const allImages = [...images.value, ...uploadedUrls];

    if (editMode.value) {
      // Modification existante
      await updateDoc(doc(db, "products", productId.value), {
        nom: nom.value,
        prix: prix.value,
        description: description.value,
        images: allImages,
        updatedAt: new Date(),
      });
      alert("Produit modifié avec succès !");
    } else {
      // Nouveau produit
      await addDoc(collection(db, "products"), {
        nom: nom.value,
        prix: prix.value,
        description: description.value,
        images: allImages,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });
      alert("Produit ajouté avec succès !");
    }

    // Reset formulaire
    nom.value = "";
    prix.value = 0;
    description.value = "";
    images.value = [];
    files.value = [];

    router.push("/adminproduits");
  } catch (err) {
    console.error(err);
    alert("Erreur : " + err.message);
  } finally {
    loading.value = false;
  }
};
</script>
