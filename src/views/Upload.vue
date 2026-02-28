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
      <h3 class="font-semibold mb-2">Réponse Cloudinary</h3>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const nom = ref("");
    const prix = ref(0);
    const file = ref(null);
    const responseData = ref(null);

    const handleFile = (e) => {
      file.value = e.target.files[0];
    };

    const uploadProduit = async () => {
      try {
        if (!nom.value || !prix.value || !file.value) {
          alert("Remplissez tous les champs et sélectionnez une image");
          return;
        }

        // 🔹 Upload vers Cloudinary via preset unsigned
        const formData = new FormData();
        formData.append("file", file.value);
        formData.append("upload_preset", "VueFirebase"); // preset Cloudinary

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dla18169k/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!data.secure_url) {
          alert("Erreur lors de l'upload sur Cloudinary");
          return;
        }

        console.log("Upload Cloudinary OK :", data.secure_url);
        responseData.value = data;

        // Reset champs
        nom.value = "";
        prix.value = 0;
        file.value = null;

        alert("Image uploadée avec succès !");
      } catch (err) {
        console.error("Erreur upload Cloudinary :", err);
        alert("Erreur lors de l'upload : " + err.message);
      }
    };

    return { nom, prix, file, handleFile, uploadProduit, responseData };
  },
};
</script>
