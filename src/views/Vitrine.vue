<template>
  <section class="py-12 px-6">
    <h2 class="text-4xl font-bold mb-10">
      Nos meilleures ventes
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <div 
        v-for="item in produits" 
        :key="item.id"
        class="vitrine-card"
      >
        <img :src="item.image" class="vitrine-img" />
        <h3 class="vitrine-title">{{ item.nom }}</h3>
      </div>

    </div>
  </section>
</template>

<script>
import iphone from "@/assets/iphone.png"
import macbook from "@/assets/macbook.png"
import ipad from "@/assets/ipad.png"
import watch from "@/assets/watch.png"

export default {
  data() {
    return {
      produits: [
        { id: 1, nom: "Bons Plans", image: iphone },
        { id: 2, nom: "iPhone", image: iphone },
        { id: 3, nom: "MacBook", image: macbook },
        { id: 4, nom: "iPad", image: ipad },
        { id: 5, nom: "Apple Watch", image: watch }
      ]
    }
  }
}
</script>

<style scoped>
.vitrine-card {
  background: #cde870; /* vert pastel */
  border-radius: 28px;
  padding: 40px 20px;
  text-align: center;
  transition: 0.4s;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  cursor: pointer;
}

.vitrine-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.vitrine-img {
  width: 70%;
  margin
