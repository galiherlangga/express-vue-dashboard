<template>
  <b-modal
    id="user-detail-modal"
    :title="`User Details - ${user.name || 'Unknown'}`"
    size="lg"
    hide-footer
    @hidden="onModalHidden"
  >
    <div v-if="user" class="user-detail-content">
      <!-- User Header -->
      <div class="user-header mb-4">
        <div class="d-flex align-items-center">
          <b-avatar
            size="60"
            :text="getInitials(user.name)"
            :variant="user.role === 'admin' ? 'danger' : 'primary'"
            class="mr-3"
          ></b-avatar>
          <div>
            <h4 class="mb-1">{{ user.name }}</h4>
            <p class="text-muted mb-0">{{ user.email }}</p>
            <b-badge
              :variant="user.role === 'admin' ? 'danger' : 'secondary'"
              class="text-capitalize mt-1"
            >
              {{ user.role }}
            </b-badge>
          </div>
          <div class="ml-auto">
            <b-badge
              :variant="user.isActive ? 'success' : 'warning'"
              pill
              class="px-3 py-2"
            >
              <b-icon
                :icon="user.isActive ? 'check-circle' : 'x-circle'"
                class="mr-1"
              ></b-icon>
              {{ user.isActive ? "Active" : "Inactive" }}
            </b-badge>
          </div>
        </div>
      </div>

      <!-- User Information Tabs -->
      <b-tabs content-class="mt-3">
        <!-- Basic Information Tab -->
        <b-tab title="Basic Information" active>
          <b-row>
            <b-col md="6">
              <b-card class="border-0 bg-light">
                <h6 class="text-muted mb-3">Personal Information</h6>
                <div class="info-item">
                  <label class="info-label">Full Name:</label>
                  <span class="info-value">{{ user.name }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">Email Address:</label>
                  <span class="info-value">{{ user.email }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">User ID:</label>
                  <span class="info-value">{{ user._id }}</span>
                </div>
              </b-card>
            </b-col>
            <b-col md="6">
              <b-card class="border-0 bg-light">
                <h6 class="text-muted mb-3">Account Details</h6>
                <div class="info-item">
                  <label class="info-label">Role:</label>
                  <span class="info-value">
                    <b-badge
                      :variant="user.role === 'admin' ? 'danger' : 'secondary'"
                      class="text-capitalize"
                    >
                      {{ user.role }}
                    </b-badge>
                  </span>
                </div>
                <div class="info-item">
                  <label class="info-label">Status:</label>
                  <span class="info-value">
                    <b-badge :variant="user.isActive ? 'success' : 'warning'">
                      {{ user.isActive ? "Active" : "Inactive" }}
                    </b-badge>
                  </span>
                </div>
                <div class="info-item">
                  <label class="info-label">Account Created:</label>
                  <span class="info-value">{{ formatDate(user.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">Last Updated:</label>
                  <span class="info-value">{{ formatDate(user.updatedAt) }}</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>

        <!-- Activity Tab -->
        <b-tab title="Activity">
          <b-card class="border-0 bg-light">
            <h6 class="text-muted mb-3">User Activity</h6>
            <div class="info-item">
              <label class="info-label">Last Login:</label>
              <span class="info-value">
                <span v-if="user.lastLogin">
                  {{ formatDate(user.lastLogin) }}
                </span>
                <span v-else class="text-muted">Never logged in</span>
              </span>
            </div>
            <div class="info-item">
              <label class="info-label">Account Age:</label>
              <span class="info-value">{{ getAccountAge(user.createdAt) }}</span>
            </div>
          </b-card>
        </b-tab>

        <!-- Permissions Tab -->
        <b-tab title="Permissions">
          <b-card class="border-0 bg-light">
            <h6 class="text-muted mb-3">User Permissions</h6>
            <div class="permissions-list">
              <div v-if="user.role === 'admin'" class="permission-item">
                <b-icon icon="shield-check" variant="success" class="mr-2"></b-icon>
                <span>Full Administrative Access</span>
              </div>
              <div v-if="user.role === 'admin'" class="permission-item">
                <b-icon icon="people" variant="success" class="mr-2"></b-icon>
                <span>User Management</span>
              </div>
              <div v-if="user.role === 'admin'" class="permission-item">
                <b-icon icon="gear" variant="success" class="mr-2"></b-icon>
                <span>System Configuration</span>
              </div>
              <div class="permission-item">
                <b-icon icon="eye" variant="primary" class="mr-2"></b-icon>
                <span>Dashboard Access</span>
              </div>
              <div class="permission-item">
                <b-icon icon="person" variant="primary" class="mr-2"></b-icon>
                <span>Profile Management</span>
              </div>
              <div v-if="user.role !== 'admin'" class="permission-item text-muted">
                <b-icon icon="x-circle" variant="secondary" class="mr-2"></b-icon>
                <span>Limited Access - Standard User</span>
              </div>
            </div>
          </b-card>
        </b-tab>
      </b-tabs>

      <!-- Action Buttons -->
      <div class="modal-actions mt-4 pt-3 border-top bg-gray-100">
        <b-row>
          <b-col>
            <b-button
              variant="outline-primary"
              @click="editUser"
              class="mr-2"
            >
              <b-icon icon="pencil" class="mr-1"></b-icon>
              Edit User
            </b-button>
            <b-button
              variant="outline-danger"
              @click="deleteUser"
              :disabled="user.role === 'admin' && getCurrentUser()?.role !== 'admin'"
            >
              <b-icon icon="trash" class="mr-1"></b-icon>
              Delete User
            </b-button>
          </b-col>
          <b-col class="text-right">
            <b-button variant="secondary" @click="closeModal">
              Close
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "UserDetailModal",
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    getInitials(name) {
      if (!name) return "?";
      return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    },
    getAccountAge(createdAt) {
      if (!createdAt) return "Unknown";
      const created = new Date(createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''}`;
      }
    },
    getCurrentUser() {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },
    editUser() {
      this.$emit("edit-user", this.user);
      this.closeModal();
    },
    deleteUser() {
      this.$emit("delete-user", this.user);
      this.closeModal();
    },
    closeModal() {
      this.$bvModal.hide("user-detail-modal");
    },
    onModalHidden() {
      this.$emit("modal-hidden");
    },
  },
};
</script>

<style scoped>
.user-detail-content {
  min-height: 400px;
}

.user-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0;
  min-width: 120px;
}

.info-value {
  font-weight: 500;
  color: #495057;
}

.permissions-list {
  space-y: 0.5rem;
}

.permission-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.permission-item:last-child {
  border-bottom: none;
}

.modal-actions {
  background-color: #f8f9fa;
  padding: 1rem 1.25rem;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>
