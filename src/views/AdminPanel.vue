<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>

    <!-- 🔹 Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- ================= UTILISATEURS ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Utilisateurs</h2>

        <div v-if="users.length === 0">Aucun utilisateur</div>

        <ul>
          <li v-for="user in users" :key="user.uid" class="flex justify-between items-center border p-2 rounded mb-2">
            <span>{{ user.email }} ({{ user.role }})</span>
            <div>
              <button @click="toggleAdmin(user)" class="mr-2 bg-blue-500 text-white px-2 rounded">
                {{ user.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
              </button>
              <button @click="deleteUser(user.uid)" class="bg-red-500 text-white px-2 rounded">
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ================= COMMANDES ================= -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Gestion Commandes</h2>

        <div v-if="commandes.length === 0">Aucune commande trouvée</div>

        <div>
          <h3 class="font-semibold mt-4">En attente</h3>
          <div v-for="commande in commandesEnAttente" :key="commande.id" class="border p-4 mb-2 rounded shadow">
            <p><strong>Client :</strong> {{ commande.userEmail }}</p>
            <p><strong>Total :</strong> {{ commande.total }} €</p>
            <p><strong>Produits :</strong></p>
            <ul class="ml-4 list-disc">
              <li v-for="(p, idx) in commande.products" :key="idx">{{ p.name }} x{{ p.quantity }}</li>
            </ul>
            <p class="mt-2">
              <strong>Status :</strong>
              <select v-model="commande.status" @change="updateStatus(commande)">
                <option>En attente</option>
                <option>Payée</option>
                <option>Expédiée</option>
                <option>Livrée</option>
                <option>Annulée</option>
              </select>
            </p>
            <button @click="deleteCommande(commande.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
              Supprimer
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mt-4">Payée</h3>
          <div v-for="commande in commandesPayees" :key="commande.id" class="border p-4 mb-2 rounded shadow">
            <p><strong>Client :</strong> {{ commande.userEmail }}</p>
            <p><strong>Total :</strong> {{ commande.total }} €</p>
            <p><strong>Produits :</strong></p>
            <ul class="ml-4 list-disc">
              <li v-for="(p, idx) in commande.products" :key="idx">{{ p.name }} x{{ p.quantity }}</li>
            </ul>
            <p class="mt-2">
              <strong>Status :</strong>
              <select v-model="commande.status" @change="updateStatus(commande)">
                <option>En attente</option>
                <option>Payée</option>
                <option>Expédiée</option>
                <option>Livrée</option>
                <option>Annulée</option>
              </select>
            </p>
            <button @click="deleteCommande(commande.id)" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
              Supprimer
            </button>
          </div>
        </div>
      </section>

      <!-- ================= PRODUITS ================= -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Produits</h2>

        <form @submit.prevent="addOrUpdateProduct" class="mb-4 flex gap-2 flex-wrap">
          <input v-model="newProduct.name" placeholder="Nom" class="border p-1 rounded" required />
          <input v-model.number="newProduct.price" type="number" placeholder="Prix" class="border p-1 rounded" required />
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" class="border p-1 rounded" required />
          <input v-model="newProduct.description" placeholder="Description" class="border p-1 rounded" required />
          <button type="submit" class="bg-green-500 text-white px-3 rounded">
            {{ newProduct.id ? 'Modifier' : 'Ajouter' }}
          </button>
        </form>

        <ul>
          <li v-for="product in products" :key="product.id" class="flex justify-between items-center border p-2 rounded mb-2">
            <span>{{ product.name }} - {{ product.price }} € - Stock: {{ product.stock }}</span>
            <div>
              <button @click="editProduct(product)" class="mr-2 bg-yellow-500 text-white px-2 rounded">Modifier</button>
              <button @click="deleteProduct(product.id)" class="bg-red-500 text-white px-2 rounded">Supprimer</button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</
