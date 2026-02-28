<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-4">Test Upload Cloudinary</h2>

    <input type="file" @change="handleFile" class="mb-2" />
    <button @click="upload" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Upload
    </button>

    <div v-if="responseData" class="mt-4 p-2 border bg-gray-100">
      <h3 class="font-semibold mb-2">Réponse Cloudinary</h3>
      <pre>{{ responseData }}</pre>

      <div v-if="responseData.secure_url" class="mt-2">
        <p>Image Preview :</p>
        <img :src="responseData.secure_url" class="max-w-full mt-2" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const file = ref(null);
    const responseData = ref(null);

    const handleFile = (e) => {
      file.value = e.target.files[0];
      console.log("Fichier sélectionné :", file.value);
    };

    const upload = async () => {
      if (!file.value) {
        alert("Sélectionnez un fichier avant d’uploader");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file.value);
        formData.append("upload_preset", "VueFirebase"); // Ton preset Cloudinary

        console.log("Envoi vers Cloudinary…");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dla18169k/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        console.log("Réponse Cloudinary :", data);

        responseData.value = data;

        if (data.secure_url) {
          alert("Upload réussi !");
        } else {
          alert("Erreur Cloudinary : vérifier le preset et Cloud Name");
        }
      } catch (err) {
        console.error("Erreur upload Cloudinary :", err);
        alert("Erreur upload : " + err.message);
      }
    };

    return { file, responseData, handleFile, upload };
  },
};
</script>
