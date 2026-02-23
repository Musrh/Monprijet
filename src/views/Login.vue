<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Authentication</h2>

    <!-- 🔹 REGISTER -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Register</h3>
      <input v-model="regEmail" placeholder="Email" class="border p-2 mb-2 w-full rounded" />
      <input v-model="regPassword" type="password" placeholder="Password" class="border p-2 mb-2 w-full rounded" />
      <button @click="register" class="bg-green-500 text-white px-4 py-2 rounded">Register</button>
    </div>

    <hr class="my-6" />

    <!-- 🔹 LOGIN -->
    <div>
      <h3 class="text-xl font-semibold mb-2">Login</h3>
      <input v-model="logEmail" placeholder="Email" class="border p-2 mb-2 w-full rounded" />
      <input v-model="logPassword" type="password" placeholder="Password" class="border p-2 mb-2 w-full rounded" />
      <button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </div>

    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default {
  setup() {
    const regEmail = ref("");
    const regPassword = ref("");
    const logEmail = ref("");
    const logPassword = ref("");
    const error = ref("");

    // 🔹 REGISTER
    const register = async () => {
      error.value = "";
      try {
        const userCredential = await
