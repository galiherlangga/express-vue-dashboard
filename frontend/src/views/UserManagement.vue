<template>
  <div class="user-management">
    <b-container fluid class="p-4">
      <!-- Page Header -->
      <div class="page-header mb-4">
        <h2 class="page-title">
          <b-icon icon="people" class="mr-2"></b-icon>
          User Management
        </h2>
        <p class="page-description text-muted">
          Manage users, roles, and permissions
        </p>
      </div>

      <!-- Actions Bar -->
      <div class="actions-bar mb-4">
        <b-row class="align-items-center">
          <b-col md="6">
            <b-input-group>
              <b-form-input
                v-model="searchQuery"
                placeholder="Search users..."
                @input="handleSearch"
              ></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-secondary">
                  <b-icon icon="search"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col md="6" class="text-right">
            <b-button variant="primary" @click="openAddUserModal">
              <b-icon icon="plus" class="mr-1"></b-icon>
              Add New User
            </b-button>
          </b-col>
        </b-row>
      </div>

      <!-- Error Alert -->
      <b-alert v-model="showError" variant="danger" dismissible class="mb-4">
        <b-icon icon="exclamation-triangle" class="mr-2"></b-icon>
        {{ errorMessage }}
      </b-alert>

      <!-- Users Table -->
      <b-card>
        <b-card-header
          class="border-0 d-flex justify-content-end align-items-center"
        >
          <div class="d-flex align-items-center">
            <small class="text-muted mr-3"
              >Last updated: {{ lastUpdated }}</small
            >
            <b-form-select
              v-model="perPage"
              :options="[10, 25, 50, 100]"
              size="sm"
              @change="onPerPageChanged"
              class="w-auto"
            >
            </b-form-select>
            <small class="text-muted ml-2">per page</small>
          </div>
        </b-card-header>
        <b-card-body class="p-0">
          <b-table
            :items="filteredUsers"
            :fields="tableFields"
            responsive
            striped
            hover
            :busy="loading"
            show-empty
            empty-text="No users found"
            :sort-by="currentSortBy"
            :sort-desc="currentSortOrder === 'desc'"
            @sort-changed="onSortChanged"
          >
            <template #table-busy>
              <div class="text-center my-4">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>Loading users...</strong>
              </div>
            </template>

            <template #cell(name)="data">
              <div class="d-flex align-items-center">
                <b-avatar
                  size="sm"
                  class="mr-2"
                  :text="getInitials(data.item.name)"
                  :variant="data.item.role === 'admin' ? 'danger' : 'primary'"
                ></b-avatar>
                {{ data.item.name }}
              </div>
            </template>

            <template #cell(role)="data">
              <b-badge
                :variant="data.item.role === 'admin' ? 'danger' : 'secondary'"
                class="text-capitalize"
              >
                {{ data.item.role }}
              </b-badge>
            </template>

            <template #cell(isActive)="data">
              <b-badge :variant="data.item.isActive ? 'success' : 'warning'">
                <b-icon
                  :icon="data.item.isActive ? 'check-circle' : 'x-circle'"
                  class="mr-1"
                ></b-icon>
                {{ data.item.isActive ? "Active" : "Inactive" }}
              </b-badge>
            </template>

            <template #cell(createdAt)="data">
              <small>{{ formatDate(data.item.createdAt) }}</small>
            </template>

            <template #cell(lastLogin)="data">
              <small v-if="data.item.lastLogin">
                {{ formatDate(data.item.lastLogin) }}
              </small>
              <small v-else class="text-muted">Never</small>
            </template>

            <template #cell(actions)="data">
              <b-button-group size="sm">
                <b-button
                  variant="outline-info"
                  @click="viewUser(data.item)"
                  v-b-tooltip.hover
                  title="View Details"
                >
                  <b-icon icon="eye"></b-icon>
                </b-button>
                <b-button
                  variant="outline-primary"
                  @click="editUser(data.item)"
                  v-b-tooltip.hover
                  title="Edit User"
                >
                  <b-icon icon="pencil"></b-icon>
                </b-button>
                <b-button
                  variant="outline-danger"
                  @click="deleteUser(data.item)"
                  v-b-tooltip.hover
                  title="Delete User"
                  :disabled="
                    data.item.role === 'admin' &&
                    getCurrentUser()?.role !== 'admin'
                  "
                >
                  <b-icon icon="trash"></b-icon>
                </b-button>
              </b-button-group>
            </template>
          </b-table>
          
          <!-- Pagination -->
          <div class="px-3 py-2" v-if="totalUsers > perPage">
            <b-row class="align-items-center">
              <b-col md="6">
                <small class="text-muted">{{ paginationInfo }}</small>
              </b-col>
              <b-col md="6" class="text-right">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalUsers"
                  :per-page="perPage"
                  align="right"
                  size="sm"
                  @change="onPageChanged"
                  :limit="5"
                ></b-pagination>
              </b-col>
            </b-row>
          </div>
        </b-card-body>
      </b-card>
    </b-container>

    <UserDetailModal
      :user="selectedUser"
      @edit-user="editUser"
      @delete-user="deleteUser"
      @modal-hidden="onModalHidden"
    />
    <UserFormModal
      modal-id="user-form-modal"
      :user="selectedUser"
      :is-edit-mode="isEditMode"
      @submit="handleUserSubmit"
      @modal-hidden="onFormModalHidden"
    />
  </div>
</template>

<script>
import axios from "axios";
import UserDetailModal from "../components/UserDetailModal.vue";
import UserFormModal from "../components/UserFormModal.vue";
export default {
  name: "UserManagement",
  components: {
    UserDetailModal,
    UserFormModal,
  },
  data() {
    return {
      loading: false,
      searchQuery: "",
      showError: false,
      errorMessage: "",
      lastUpdated: "",
      currentPage: 1,
      perPage: 10,
      totalUsers: 0,
      totalPages: 1,
      tableFields: [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "role", label: "Role", sortable: true },
        { key: "isActive", label: "Status", sortable: true },
        { key: "createdAt", label: "Joined", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      users: [],
      allUsers: [],
      selectedUser: {},
      isEditMode: false,
      currentSortBy: "createdAt",
      currentSortOrder: "desc",
      searchTimeout: null,
    };
  },
  computed: {
    filteredUsers() {
      return this.users;
    },
    totalRows() {
      return this.totalUsers;
    },
    paginationInfo() {
      const start = (this.currentPage - 1) * this.perPage + 1;
      const end = Math.min(this.currentPage * this.perPage, this.totalUsers);
      return `Showing ${start} to ${end} of ${this.totalUsers} users`;
    },
  },
  methods: {
    async fetchUsers(resetPage = false) {
      this.loading = true;
      this.showError = false;

      if (resetPage) {
        this.currentPage = 1;
      }
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
          page: this.currentPage.toString(),
          limit: this.perPage.toString(),
          sortBy: this.currentSortBy,
          sortOrder: this.currentSortOrder,
        });

        if (this.searchQuery.trim()) {
          params.append("search", this.searchQuery.trim());
        }
        const response = await axios.get(`/api/users?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          const res_data = response.data.data || [];
          this.users = Array.isArray(res_data.users) ? res_data.users : [];

          if (res_data.pagination) {
            this.totalUsers = res_data.pagination.totalUsers || 0;
            this.totalPages = res_data.pagination.totalPages || 1;
            this.currentPage = res_data.pagination.currentPage || 1;
          }

          this.lastUpdated = new Date().toLocaleString();

          this.$bvToast.toast(`Loaded ${this.users.length} users`, {
            title: "Success",
            variant: "success",
            autoHideDelay: 1500,
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users: ", error);
        this.users = [];
        this.totalUsers = 0;
        this.totalPages = 1;
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    handleError(error) {
      if (error.response?.status === 401) {
        this.errorMessage = "Unauthorized access. Please log in again.";
        setTimeout(() => {
          localStorage.removeItem("token");
          this.$router.push("/login");
        }, 2000);
      } else if (error.response?.status === 403) {
        this.errorMessage =
          "You do not have permission to access this resource.";
      } else {
        this.errorMessage = error.message || "An unexpected error occurred.";
      }
      this.showError = true;
    },
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.fetchUsers(true);
      }, 500);
    },
    refreshData() {
      this.fetchUsers();
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    getInitials(name) {
      return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    },
    getCurrentUser() {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },
    viewUser(user) {
      this.selectedUser = user;
      this.$bvModal.show("user-detail-modal");
    },
    openAddUserModal() {
      this.isEditMode = false;
      this.selectedUser = {};
      this.$bvModal.show("user-form-modal");
    },
    editUser(user) {
      this.isEditMode = true;
      this.selectedUser = { ...user };
      this.$bvModal.show("user-form-modal");
    },
    async deleteUser(user) {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        `Are you sure you want to delete user ${user.name}?`,
        {
          title: "Confirm Delete",
          size: "md",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "Delete",
          cancelTitle: "Cancel",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        }
      );
      if (confirmed) {
        this.loading = true;
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`/api/users/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.$bvToast.toast(`User ${user.name} deleted successfully`, {
            title: "Success",
            variant: "success",
            autoHideDelay: 3000,
          });

          await this.fetchUsers();
        } catch (error) {
          console.error("Error deleting user: ", error);
          this.$bvToast.toast(
            error.response?.data?.message || "Failed to delete user",
            {
              title: "Error",
              variant: "danger",
              autoHideDelay: 3000,
            }
          );
        } finally {
          this.loading = false;
        }
      }
    },
    async handleUserSubmit({ data, isEditMode, userId }) {
      try {
        console.log("submiting");
        const token = localStorage.getItem("token");
        let response;

        if (isEditMode) {
          response = await axios.put(`/api/users/${userId}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios.post("/api/users", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (response.data && response.data.success) {
          this.$bvToast.toast(
            `User ${isEditMode ? "updated" : "created"} successfully`,
            {
              title: "Success",
              variant: "success",
              autoHideDelay: 3000,
            }
          );
          await this.fetchUsers();
          this.$bvModal.hide("user-form-modal");
        } else {
          throw new Error(
            response.data.message ||
              `Failed to ${isEditMode ? "update" : "create"} user`
          );
        }
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} user`,
          error
        );
        this.$bvToast.toast(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} user`,
          {
            title: "Error",
            variant: "danger",
            autoHideDelay: 3000,
          }
        );
        throw error;
      }
    },
    onModalHidden() {
      this.selectedUser = {};
    },
    onFormModalHidden() {
      this.selectedUser = {};
      this.isEditMode = false;
    },
    onPageChanged(page) {
      this.currentPage = page;
      this.fetchUsers();
    },
    onPerPageChanged(perPage) {
      this.perPage = perPage;
      this.currentPage = 1; // Reset to first page on per-page change
      this.fetchUsers();
    },
    onSortChanged(ctx) {
      if (ctx.sortBy) {
        this.currentSortBy = ctx.sortBy;
        this.currentSortOrder = ctx.sortDesc ? "desc" : "asc";
        this.currentPage = 1;
        this.fetchUsers();
      }
    },
  },
  mounted() {
    this.fetchUsers();

    // Auto-refresh every 5 minutes
    setInterval(() => {
      this.refreshData();
    }, 300000); // 5 minutes in milliseconds
  },
};
</script>

<style scoped>
.user-management {
  background: transparent;
}

.page-header {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.actions-bar {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-wrapper {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

/* Responsive pagination */
@media (max-width: 576px) {
  .pagination-wrapper {
    text-align: center;
  }
  
  .pagination-wrapper .text-md-right {
    text-align: center !important;
  }
}
</style>

