<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">
      {{ editMode ? "Modifier Produit" : "Ajouter Produit" }}
    </h2>

    <input v-model="nom" placeholder="Nom" class="border p-2 mb-2 w-full"/>
    <input v-model.number="prix" type="number" placeholder="Prix"
           class="border p-2 mb-2 w-full"/>

    <textarea v-model="description"
              placeholder="Description"
              class="border p-2 mb-4 w-full"></textarea>

    <input type="file" multiple @change="handleFiles" class="mb-4"/>

    <!-- Preview images -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div v-for="(img, index) in images" :key="index" class="relative">
        <img :src="img" class="w-full h-24 object-cover rounded"/>
        <button @click="removeImage(index)"
                class="absolute top-1 right-1 bg-red-600 text-white px-2 text-xs rounded">
          X
        </button>
      </div>
    </div>

    <button @click="saveProduit"
            class="bg-green-600 text-white px-4 py-2 rounded">
      {{ editMode ? "Mettre à jour" : "Ajouter" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();
const route = useRoute();

const nom = ref("");
const prix = ref(null);
const description = ref("");
const files = ref([]);
const images = ref([]);
const editMode = ref(false);
const productId = ref(null);

onMounted(async () => {
  if (route.params.id) {
    editMode.value = true;
    productId.value = route.params.id;

    const snap = await getDoc(doc(db, "products", productId.value));
    const data = snap.data();

    nom.value = data.nom;
    prix.value = data.prix;
    description.value = data.description;
    images.value = data.images || [];
  }
});

const handleFiles = (e) => {
  files.value = Array.from(e.target.files);
};

const uploadImages = async () => {
  for (let file of files.value) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "VueFirebase");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dla18l69k/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    images.value.push(data.secure_url);
  }
};

const saveProduit = async () => {
  if (!auth.currentUser) return alert("Connexion requise");

  await uploadImages();

  if (editMode.value) {
    await updateDoc(doc(db, "products", productId.value), {
      nom: nom.value,
      prix: prix.value,
      description: description.value,
      images: images.value
    });
    alert("Produit mis à jour !");
  } else {
    await addDoc(collection(db, "products"), {
      nom: nom.value,
      prix: prix.value,
      description: description.value,
      images: images.value,
      createdBy: auth.currentUser.uid,
      createdAt: new Date()
    });
    alert("Produit ajouté !");
  }

  nom.value = "";
  prix.value = null;
  description.value = "";
  images.value = [];
};
const removeImage = (index) => {
  images.value.splice(index, 1);
};
</script>
