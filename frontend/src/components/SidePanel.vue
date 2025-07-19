<template>
  <div class="side-panel" :class="{ collapsed: isCollapsed }">
    <!-- Panel content -->
    <div class="panel-content">
      <!-- Logo/Brand section -->
      <div class="brand-section">
        <div class="brand-logo">
          <b-icon
            icon="grid-3x3-gap"
            font-scale="1.5"
            class="text-primary"
          ></b-icon>
          <span class="brand-text ml-2">Admin Panel</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <ul class="menu-list">
          <!-- Dashboard -->
          <li class="menu-item">
            <router-link
              to="/dashboard"
              class="menu-link"
              :class="{ active: $route.path === '/dashboard' }"
              @click="handleMenuClick"
            >
              <b-icon icon="speedometer2" class="menu-icon"></b-icon>
              <span class="menu-text">Dashboard</span>
            </router-link>
          </li>

          <!-- User Management -->
          <li class="menu-item" v-if="userRole === 'admin'">
            <router-link
              to="/users"
              class="menu-link"
              :class="{ active: $route.path.startsWith('/users') }"
              @click="handleMenuClick"
            >
              <b-icon icon="people" class="menu-icon"></b-icon>
              <span class="menu-text">User Management</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Footer section -->
      <div class="panel-footer">
        <div class="user-info">
          <b-icon icon="person-circle" class="user-avatar"></b-icon>
          <div class="user-details">
            <small class="user-name">{{ userName }}</small>
            <small class="user-role text-muted">{{ userRole }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidePanel",
  data() {
    return {
      userName: "Loading...",
      userRole: "user",
    };
  },
  computed: {
    isAdmin() {
      return this.userRole === "admin";
    },
  },
  methods: {
    handleMenuClick() {
      // Optional: Auto-collapse on mobile when menu item is clicked
      if (window.innerWidth <= 768) {
        // Handle mobile menu click if needed
      }
    },
    loadUserData() {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        this.userName = user.name || "User";
        this.userRole = user.role || "user";
      }
    },
  },
  mounted() {
    this.loadUserData();
  },
  watch: {
    $route() {
      // Update user data when route changes (in case user data was updated)
      this.loadUserData();
    },
  },
};
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: #2c3e50;
  color: white;
  width: 260px;
  z-index: 9000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.brand-section {
  padding: 0 20px 30px;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
}

.brand-logo {
  display: flex;
  align-items: center;
}

.brand-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ecf0f1;
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-link:hover {
  background: #34495e;
  color: #ecf0f1;
  text-decoration: none;
  border-left-color: #3498db;
}

.menu-link.active {
  background: #34495e;
  color: #3498db;
  border-left-color: #3498db;
}

.menu-icon {
  min-width: 20px;
  font-size: 1.1rem;
}

.menu-text {
  margin-left: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.panel-footer {
  padding: 20px;
  border-top: 1px solid #34495e;
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  font-size: 2rem;
  margin-right: 10px;
  color: #3498db;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  color: #ecf0f1;
  font-weight: 500;
}

.user-role {
  text-transform: capitalize;
  font-size: 0.8rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .side-panel {
    width: 260px;
    transform: translateX(-100%);
  }
}

/* Scrollbar styling for the nav menu */
.nav-menu::-webkit-scrollbar {
  width: 4px;
}

.nav-menu::-webkit-scrollbar-track {
  background: #2c3e50;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: #34495e;
  border-radius: 2px;
}

.nav-menu::-webkit-scrollbar-thumb:hover {
  background: #4a6741;
}
</style>
