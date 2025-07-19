<template>
  <div class="settings">
    <b-container class="mt-4">
      <b-row>
        <b-col cols="12">
          <h2>Settings</h2>
          <b-card class="mt-3">
            <b-card-title>Application Settings</b-card-title>
            <b-card-text>
              This is the settings page. Notice how the navbar is automatically included here too!
            </b-card-text>
            
            <b-form>
              <b-form-group label="Theme">
                <b-form-select v-model="settings.theme" :options="themeOptions"></b-form-select>
              </b-form-group>
              
              <b-form-group label="Notifications">
                <b-form-checkbox v-model="settings.notifications">
                  Enable email notifications
                </b-form-checkbox>
              </b-form-group>
              
              <b-button variant="success">Save Settings</b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Settings-page',
  data() {
    return {
      settings: {
        theme: 'light',
        notifications: true
      },
      themeOptions: [
        { value: 'light', text: 'Light Theme' },
        { value: 'dark', text: 'Dark Theme' }
      ]
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 0;
}
</style>
