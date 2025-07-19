<template>
  <div class="dashboard">
    <b-container fluid class="p-4">
      <!-- Welcome Header -->
      <div class="welcome-header mb-4">
        <h2 class="welcome-title">
          <b-icon icon="speedometer2" class="mr-2"></b-icon>
          Dashboard
        </h2>
        <p class="welcome-text text-muted">
          Welcome back! Here's what's happening with your application.
        </p>
      </div>
      
      <!-- Quick Actions -->
      <b-row class="mb-4">
        <b-col cols="12">
          <h4 class="section-title mb-3">Quick Actions</h4>
        </b-col>
        <b-col md="4">
          <b-card class="action-card text-center h-100" @click="goToUsers">
            <b-icon icon="people" font-scale="3" variant="primary" class="mb-3"></b-icon>
            <b-card-title>Manage Users</b-card-title>
            <b-card-text>View and manage user accounts</b-card-text>
            <b-button variant="primary" size="sm">Go to Users</b-button>
          </b-card>
        </b-col>
        
        <b-col md="4">
          <b-card class="action-card text-center h-100" @click="goToProfile">
            <b-icon icon="person" font-scale="3" variant="success" class="mb-3"></b-icon>
            <b-card-title>Your Profile</b-card-title>
            <b-card-text>Update your account information</b-card-text>
            <b-button variant="success" size="sm">View Profile</b-button>
          </b-card>
        </b-col>
        
        <b-col md="4">
          <b-card class="action-card text-center h-100" @click="goToSettings">
            <b-icon icon="gear" font-scale="3" variant="warning" class="mb-3"></b-icon>
            <b-card-title>Settings</b-card-title>
            <b-card-text>Configure application settings</b-card-text>
            <b-button variant="warning" size="sm">Open Settings</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Dashboard-page',
  methods: {
    goToUsers() {
      this.$router.push('/users')
    },
    goToProfile() {
      this.$router.push('/profile')
    },
    goToSettings() {
      this.$router.push('/settings')
    }
  }
}
</script>

<style scoped>
.dashboard {
  background: transparent;
}

.welcome-header {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
}

.stats-card, .action-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stats-card:hover, .action-card:hover {
  transform: translateY(-2px);
  cursor: pointer;
}

.stats-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.action-card {
  border: 1px solid #e9ecef;
  padding: 1.5rem;
}
</style>
