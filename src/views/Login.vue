<template>
  <div class="min-h-screen flex">

    <!-- Colonne gauche -->
    <div class="w-full md:w-1/2 p-6">
      <div class="max-w-md">

        <h2 class="text-2xl font-bold mb-4">Authentication</h2>

        <!-- Message succès et Logout si connecté -->
        <div v-if="isAuthenticated" class="mb-4">
          <p class="text-green-600 font-semibold mb-2">Connexion réussie !</p>

          <span class="mr-2">
            Connecté en tant que {{ userEmail }}
          </span>

          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <!-- Register -->
        <div v-if="!isAuthenticated" class="mb-6">

          <h3 class="text-xl font-semibold mb-2">Register</h3>

          <input
            v-model="regEmail"
            placeholder="Email"
            class="border p-2 w-full mb-2"
          />

          <input
            v-model="regPassword"
            type="password"
            placeholder="Password"
            class="border p-2 w-full mb-2"
          />

          <button
            @click="register"
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Register
          </button>

        </div>

        <hr class="my-4" v-if="!isAuthenticated" />

        <!-- Login -->
        <div v-if="!isAuthenticated">

          <h3 class="text-xl font-semibold mb-2">Login</h3>

          <input
            v-model="logEmail"
            placeholder="Email"
            class="border p-2 w-full mb-2"
          />

          <input
            v-model="logPassword"
            type="password"
            placeholder="Password"
            class="border p-2 w-full mb-2"
          />

          <button
            @click="login"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>

        </div>

        <!-- Message info -->
        <p v-if="message" class="text-green-600 mt-2">
          {{ message }}
        </p>

        <!-- Message erreur -->
        <p v-if="error" class="text-red-600 mt-2">
          {{ error }}
        </p>

      </div>
    </div>

    <!-- Colonne droite (desktop uniquement) -->
    <div class="hidden md:block md:w-1/2 bg-gray-100"></div>

  </div>
</template>
