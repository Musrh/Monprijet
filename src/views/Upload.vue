<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Uploader un produit</h1>

    <input type="text" v-model="nom" placeholder="Nom du produit" class="border p-2 w-full mb-2"/>
    <input type="number" v-model.number="prix" placeholder="Prix" class="border p-2 w-full mb-2"/>
    <input type="file" @change="onFileChange" class="border p-2 w-full mb-2"/>

    <button @click="uploadImage" class="bg-blue-500 text-white px-4 py-2 rounded">
      Ajouter Produit
    </button>

    <div v-if="uploadResponse" class="mt-4 p-2 border rounded bg-gray-50">
      <h2 class="font-semibold mb-2">Réponse Cloudinary :</h2>
      <pre class="text-xs">{{ uploadResponse }}</pre>
      <p class="mt-2"><strong>URL publique (secure_url) :</strong> {{ uploadResponse.secure_url }}</p>
      <img v-if="uploadResponse.secure_url" :src="uploadResponse.secure_url" class="w-40 h-40 object-cover mt-2 rounded"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const nom = ref("");
const prix = ref(0);
const file = ref(null);
const uploadResponse = ref(null);

const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const uploadImage = async () => {
  if (!nom.value || !prix.value || !file.value) {
    alert("Veuillez remplir tous les champs et sélectionner une image.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("upload_preset", "VueFirebase"); // ton preset Cloudinary

    // 🔹 Upload vers Cloudinary
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dla18l69k/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    uploadResponse.value = data; // sauvegarde toute la réponse

    console.log("Cloudinary response:", data);
    alert("Upload réussi ! Vérifie console ou section ci-dessous.");

    // 🔹 Stocker dans Firestore
    await addDoc(collection(db, "produits"), {
      nom: nom.value,
      prix: prix.value,
      image: data.secure_url,
      createdAt: serverTimestamp(),
    });

    alert("Produit ajouté dans Firestore !");
    // Reset
    nom.value = "";
    prix.value = 0;
    file.value = null;
  } catch (err) {
    console.error("Erreur upload:", err);
    alert("Erreur lors de l'upload : " + err.message);
  }
};
</script>
