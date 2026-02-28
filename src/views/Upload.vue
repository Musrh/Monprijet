<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-2xl font-bold mb-4">Ajouter un produit</h2>

    <input v-model="nom" placeholder="Nom du produit" class="border p-2 mb-2 w-full"/>

    <input v-model.number="prix" type="number" placeholder="Prix (€)" class="border p-2 mb-2 w-full"/>

    <textarea
      v-model="description"
      placeholder="Description du produit"
      class="border p-2 mb-2 w-full"
    ></textarea>

    <input type="file" @change="handleFile" class="mb-2"/>

    <button
      @click="uploadProduit"
      class="bg-green-500 text-white px-4 py-2 rounded"
      :disabled="!file || !nom || !prix"
    >
      Ajouter produit
    </button>

    <div v-if="imageUrl" class="mt-4">
      <img :src="imageUrl" class="w-48 rounded shadow"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const nom = ref("");
const prix = ref(null);
const description = ref("");
const file = ref(null);
const imageUrl = ref("");

const handleFile = (e) => {
  file.value = e.target.files[0];
};

const uploadProduit = async () => {
  if (!auth.currentUser) {
    alert("Vous devez être connecté");
    return;
  }

  try {
    // 🔹 Upload Cloudinary
    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("upload_preset", "VueFirebase");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dla18l69k/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    imageUrl.value = data.secure_url;

    // 🔹 Ajouter dans Firestore (collection products)
    await addDoc(collection(db, "products"), {
      nom: nom.value,
      prix: prix.value,
      description: description.value,
      image: imageUrl.value,
      createdBy: auth.currentUser.uid,
      createdAt: new Date()
    });

    alert("Produit ajouté avec succès !");

    // Reset
    nom.value = "";
    prix.value = null;
    description.value = "";
    file.value = null;
    imageUrl.value = "";

  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout");
  }
};
</script>
