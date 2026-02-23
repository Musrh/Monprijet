
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
        <div v-if="users.length === 0">Aucun utilisateur trouvé</div>
        <ul>
          <li v-for="userItem in users" :key="userItem.uid" class="mb-2 flex justify-between items-center border p-2 rounded">
            <span>{{ userItem.email }} ({{ userItem.role }})</span>
            <div>
              <button @click="toggleAdmin(userItem)" class="mr-2 bg-blue-500 text-white px-2 rounded">
                {{ userItem.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
              </button>
              <button @click="deleteUser(userItem.uid)" class="bg-red-500 text-white px-2 rounded">
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>

        <div class="mb-2">
          <label>Filtrer par statut :</label>
          <select v-model="filterStatus" @change="filterOrders">
            <option value="">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Payée">Payée</option>
          </select>
        </div>

        <div v-if="filteredOrders.length === 0">
          Aucune commande trouvée
        </div>

        <div v-for="order in filteredOrders" :key="order.id" class="border p-4 mb-4 rounded shadow">
          <p><strong>Client :</strong> {{ order.userEmail }}</p>
          <p><strong>Total :</strong> {{ order.total }} €</p>
          <p><strong>Produits :</strong></p>
          <ul class="ml-4 list-disc">
            <li v-for="(product, idx) in order.products" :key="idx">
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
          <button @click="deleteOrder(order.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
            Supprimer
          </button>
        </div>
      </section>

      <!-- ================= PRODUITS ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Produits</h2>

        <form @submit.prevent="addProduct" class="mb-4 flex gap-2 flex-wrap">
          <input v-model="newProduct.name" placeholder="Nom" class="border p-1 rounded" required />
          <input v-model.number="newProduct.price" type="number" placeholder="
