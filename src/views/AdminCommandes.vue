<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Commandes des utilisateurs</h1>

    <div v-if="loading" class="text-gray-600">Chargement des commandes...</div>
    <div v-else-if="commandes.length === 0" class="text-red-500">Aucune commande trouvée...</div>

    <table v-else class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Email</th>
          <th class="border p-2">Montant</th>
          <th class="border p-2">Statut</th>
          <th class="border p-2">Date</th>
          <th class="border p-2">Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="commande in commandes" :key="commande.id">
          <td class="border p-2">{{ commande.email }}</td>
          <td class="border p-2">{{ commande.montant }} {{ commande.devise }}</td>
          <td class="border p-2">{{ commande.statut }}</td>
          <td class="border p-2">{{ commande.date?.toDate().toLocaleString() }}</td>
          <td class="border p-2">
            <ul>
              <li v-for="item in commande.items" :key="item.id">
                {{ item.nom }} × {{ item.quantity }}
              </li>
