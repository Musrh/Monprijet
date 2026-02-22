<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- Vérification Admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- ================= UTILISATEURS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Utilisateurs</h2>

        <div v-if="users.length === 0">Aucun utilisateur</div>

        <div
          v-for="userItem in users"
          :key="userItem.uid"
          class="border p-3 mb-2 rounded flex justify-between items-center"
        >
          <span>{{ userItem.email }} ({{ userItem.role }})</span>

          <div>
            <button
              @click="toggleAdmin(userItem)"
              class="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              {{ userItem.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
            </button>

            <button
              @click="deleteUser(userItem.uid)"
              class="bg-red-500 text-white px-2 py-1 rounded"
            >
              Supprimer
            </button>
          </div>
        </div>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>

        <div v-if="orders.length === 0">
          Aucune commande trouvée
        </div>

        <div
          v-for="order in orders"
          :key="order.id"
          class="border p-4 mb-4 rounded shadow"
        >
          <p><strong>Client :</strong> {{ order.userEmail }}</p>
          <p><strong>Total :</strong> {{ order.total }} €</p>

          <p><strong>Produits :</strong></p>
          <ul>
            <li v-for="(product, index) in order.products" :key="index">
              {{ product.name }} x{{ product.quantity }}
            </li>
          </ul>

          <p class="mt-2">
            <strong>Status :</strong>
            <select v-model="order.status" @change="updateStatus(order)">
              <option>En attente</option>
              <option>Payée</option>
              <option>Expédiée</option>
              <option>Livrée</option>
              <option>Annulée</option>
            </select>
          </p>

          <button
            @click="deleteOrder(order.id)"
            class="bg-red-500 text-white px-3 py-1 rounded mt-2"
          >
            Supprimer
          </button>
        </div>
      </section>

      <!-- ================= PRODUITS ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Produits</h2>

        <form @submit.prevent="addProduct" class="mb-4 flex flex-wrap gap-2">
          <input v-model="newProduct.name" placeholder="Nom" required />
          <input v-model.number="newProduct.price" type="number" placeholder="Prix" required />
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" required />
          <input v-model="newProduct.description" placeholder="Description" required />
          <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded">
            Ajouter
          </button>
        </form>

        <div
          v-for="product in products"
          :key="
