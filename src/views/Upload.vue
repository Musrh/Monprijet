<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-4">Uploader un produit</h2>

    <!-- Nom -->
    <div class="mb-2">
      <label class="block font-medium">Nom du produit</label>
      <input v-model="nom" type="text" class="border p-2 w-full" />
    </div>

    <!-- Prix -->
    <div class="mb-2">
      <label class="block font-medium">Prix (€)</label>
      <input v-model.number="prix" type="number" class="border p-2 w-full" />
    </div>

    <!-- Description -->
    <div class="mb-2">
      <label class="block font-medium">Description</label>
      <textarea v-model="description" class="border p-2 w-full"></textarea>
    </div>

    <!-- Images -->
    <div class="mb-2">
      <label class="block font-medium">Images</label>
      <input type="file" @change="handleFiles" multiple />
    </div>

    <!-- Bouton Upload -->
    <button
      @click="uploadProduit"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
      :disabled="!nom || !prix || !description || files.length === 0"
    >
      Uploader
    </button>

    <!-- Affichage réponse -->
    <div v-if="responseData" class="mt-4 p-2 border bg-gray-100">
      <h3 class="font-semibold mb-2">Réponse Cloudinary + Firestore</h3>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default {
  setup() {
    const nom = ref("");
    const prix = ref(0);
    const description = ref("");
    const files = ref([]);
    const responseData = ref(null);

    const handleFiles = (e) => {
      files.value = Array.from(e.target.files);
    };

    const uploadProduit = async () => {
      try {
        if (!auth.currentUser) {
          alert("Vous devez être connecté pour ajouter un produit");
          return;
        }
        if (!nom.value || !prix.value || !description.value || files.value.length === 0) {
          alert("Remplissez tous les champs et sélectionnez au moins une image");
          return;
        }

        const uploadedImages = [];

        for (let file of files.value) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "VueFirebase"); // preset unsigned

          const cloudRes = await fetch(
            "https://api.cloudinary.com/v1_1/dla18169k/image/upload",
            { method: "POST", body: formData }
          );
          const cloudData = await cloudRes.json();

          if (cloudData.error) {
            console.error("Erreur Cloudinary :", cloudData.error);
            alert("Erreur Cloudinary : " + cloudData.error.message);
            return;
          }

          uploadedImages.push(cloudData.secure_url);
        }

        // Stockage Firestore
        const docRef = await addDoc(collection(db, "products"), {
          nom: nom.value,
          prix: prix.value,
          description: description.value,
          images: uploadedImages,
          createdBy: auth.currentUser.uid,
          createdAt: new Date(),
        });

        responseData.value = {
          firestoreId: docRef.id,
          images: uploadedImages
        };

        // Reset
        nom.value = "";
        prix.value = 0;
        description.value = "";
        files.value = [];

        alert("Produit ajouté avec succès !");
      } catch (err) {
        console.error("Erreur :", err);
        alert("Erreur lors de l'upload : " + err.message);
      }
    };

    return { nom, prix, description, files, handleFiles, uploadProduit, responseData };
  },
};
</script>
