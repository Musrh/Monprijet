<template>
  <div :class="theme">

    <!-- 🔹 NAVBAR -->
    <nav class="navbar">

      <div class="nav-left">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
        <router-link to="/produits" class="nav-link">Produits</router-link>
      </div>

      <div class="nav-right">

        <router-link to="/cart" class="nav-link cart">
          🛒
        </router-link>

        <router-link v-if="!user" to="/login" class="nav-link">
          Login
        </router-link>

        <button v-if="user" @click="logout" class="btn-logout">
          Logout
        </button>

        <!-- ✅ SWITCH THEME EN DERNIER -->
        <select v-model="theme" @change="applyTheme" class="theme-select">
          <option value="dark">Dark</option>
          <option value="pastel">Pastel</option>
        </select>

      </div>

    </nav>

    <!-- 🔹 SLIDER FULL WIDTH -->
    <div class="slider">
      <img src="@/assets/hero.png" alt="banner" />
    </div>

    <!-- 🔹 ROUTER -->
    <router-view />

  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: localStorage.getItem("theme") || "dark"
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    }
  },

  methods: {
    applyTheme() {
      document.body.className = this.theme
      localStorage.setItem("theme", this.theme)
    },

    logout() {
      this.$store.dispatch("logout")
    }
  },

  mounted() {
    document.body.className = this.theme
  }
}
</script>

<style>

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* 🔹 NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111827;
  padding: 8px 20px;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.nav-link:hover {
  opacity: 0.8;
}

.btn-logout {
  background: crimson;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.theme-select {
  padding: 5px 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* 🔹 SLIDER */
.slider {
  width: 100%;
}

.slider img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* 🔹 THEMES */
.dark {
  background: #0f172a;
  color: white;
  min-height: 100vh;
}

.pastel {
  background: #fce7f3;
  color: #1f2937;
  min-height: 100vh;
}

</style>
