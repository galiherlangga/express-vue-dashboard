<template>
  <b-navbar variant="dark" type="dark" class="app-navbar">
    <b-navbar-brand href="#" @click="$router.push('/dashboard')">
      <b-icon icon="speedometer2" class="mr-2"></b-icon>
      Dashboard App
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <!-- User info if available -->
      <b-nav-text v-if="user" class="mr-3 text-light">
        Welcome, {{ user.name }}
      </b-nav-text>

      <b-nav-item-dropdown text="Account" right>
        <b-dropdown-item @click="goToProfile">
          <b-icon icon="person" class="mr-2"></b-icon>
          Profile
        </b-dropdown-item>
        <b-dropdown-item @click="goToSettings">
          <b-icon icon="gear" class="mr-2"></b-icon>
          Settings
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="logout">
          <b-icon icon="box-arrow-right" class="mr-2"></b-icon>
          Logout
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: "Navbar-component",
  data() {
    return {
      user: null,
    };
  },
  methods: {
    logout() {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Clear user data
      this.user = null;

      // Show success message (optional)
      this.$bvToast.toast("You have been logged out successfully", {
        title: "Logout",
        variant: "success",
        solid: true,
        autoHideDelay: 3000,
      });

      // Redirect to login
      this.$router.push("/login");
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    goToSettings() {
      this.$router.push("/settings");
    },
    async loadUserData() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // You can make an API call here to get user data
          // For now, we'll decode the user info from the token or use stored data
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            this.user = JSON.parse(storedUser);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    },
  },
  mounted() {
    this.loadUserData();
  },
  watch: {
    // Watch for route changes to update user data
    $route() {
      this.loadUserData();
    },
  },
};
</script>

<style scoped>
.app-navbar {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-weight: bold;
  cursor: pointer;
}

.navbar-brand:hover {
  opacity: 0.8;
}
</style>
