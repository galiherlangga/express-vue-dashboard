<template>
  <div class="profile">
    <b-container class="mt-4">
      <b-row>
        <b-col cols="12">
          <h2>User Profile</h2>
          <b-card class="mt-3">
            <b-card-title>Profile Information</b-card-title>
            <b-card-text>
              This is the user profile page. The navbar is automatically included!
            </b-card-text>
            
            <b-row>
              <b-col md="6">
                <b-form-group label="Name">
                  <b-form-input v-model="user.name" readonly></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Email">
                  <b-form-input v-model="user.email" readonly></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            
            <b-button variant="primary">Edit Profile</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Profile-page',
  data() {
    return {
      user: {
        name: 'Loading...',
        email: 'Loading...'
      }
    }
  },
  mounted() {
    // Load user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      this.user = JSON.parse(userData)
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 0;
}
</style>
