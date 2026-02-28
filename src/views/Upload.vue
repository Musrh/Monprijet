<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-4">Uploader un produit</h2>

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
      <textarea v-model="description" class="border p-2 w-full"></textarea>
    </div>

    <div class="mb-2">
      <label class="block font-medium">Image</label>
      <input type="file" @change="handleFile" />
    </div>

    <button
      @click="uploadProduit"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
    >
      Uploader
    </button>

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
    const file = ref(null);
    const responseData = ref(null);

    const handleFile = (e) => {
      file.value = e.target.files[0];
    };

    const uploadProduit = async () => {
      try {
        if (!auth.currentUser) {
          alert("Vous devez être connecté pour ajouter un produit");
          return;
        }
        if (!nom.value || !prix.value || !file.value || !description.value) {
          alert("Remplissez tous les champs et sélectionnez une image");
          return;
        }

        // 🔹 Upload Cloudinary unsigned
        const formData = new FormData();
        formData.append("file", file.value);
        formData.append("upload_preset", "VueFirebaseUnsigned"); // <-- preset unsigned
        formData.append("folder", "produits"); // optionnel : dossier Cloudinary

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/dla18l69k/image/upload",
          { method: "POST", body: formData }
        );

        const cloudData = await cloudRes.json();

        if (!cloudData.secure_url) {
          alert("Erreur lors de l'upload sur Cloudinary");
          return;
        }

        // 🔹 Stockage Firestore
        const docRef = await addDoc(collection(db, "products"), {
          nom: nom.value,
          prix: prix.value,
          description: description.value,
          images: [cloudData.secure_url],
          createdBy: auth.currentUser.uid,
          createdAt: new Date(),
        });

        responseData.value = {
          cloudinary: cloudData,
          firestoreId: docRef.id,
        };

        // Reset
        nom.value = "";
        prix.value = 0;
        description.value = "";
        file.value = null;

        alert("Produit ajouté avec succès !");
      } catch (err) {
        console.error("Erreur :", err);
        alert("Erreur lors de l'upload : " + err.message);
      }
    };

    return { nom, prix, description, file, handleFile, uploadProduit, responseData };
  },
};
</script>
