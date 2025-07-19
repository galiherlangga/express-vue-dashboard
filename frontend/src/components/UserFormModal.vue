<template>
  <b-modal
    :id="modalId"
    :title="isEditMode ? `Edit User - ${formData.name}` : 'Add New User'"
    size="lg"
    hide-footer
    @hidden="onModalHidden"
    @show="onModalShow"
  >
    <form @submit.prevent="handleSubmit" class="user-form">
      <!-- Alert for errors -->
      <b-alert v-model="showError" variant="danger" dismissible class="mb-3">
        <b-icon icon="exclamation-triangle" class="mr-2"></b-icon>
        {{ errorMessage }}
      </b-alert>

      <!-- Alert for success -->
      <b-alert v-model="showSuccess" variant="success" dismissible class="mb-3">
        <b-icon icon="check-circle" class="mr-2"></b-icon>
        {{ successMessage }}
      </b-alert>

      <!-- Full Name Field -->
      <b-form-group
        label="Full Name"
        label-for="user-name"
        :invalid-feedback="nameError"
        :state="nameState"
      >
        <b-form-input
          id="user-name"
          v-model="formData.name"
          type="text"
          placeholder="Enter full name"
          :state="nameState"
          @blur="validateName"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Email Field -->
      <b-form-group
        label="Email Address"
        label-for="user-email"
        :invalid-feedback="emailError"
        :state="emailState"
      >
        <b-form-input
          id="user-email"
          v-model="formData.email"
          type="email"
          placeholder="Enter email address"
          :state="emailState"
          @blur="validateEmail"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Password Field (only for new users or when explicitly changing) -->
      <b-form-group
        v-if="!isEditMode || showPasswordField"
        label="Password"
        label-for="user-password"
        :invalid-feedback="passwordError"
        :state="passwordState"
      >
        <b-input-group>
          <b-form-input
            id="user-password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="
              isEditMode
                ? 'Enter new password (leave blank to keep current)'
                : 'Enter password'
            "
            :state="passwordState"
            @blur="validatePassword"
            :required="!isEditMode"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              variant="outline-secondary"
              @click="togglePasswordVisibility"
              type="button"
            >
              <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <!-- Change Password Toggle (only in edit mode) -->
      <div v-if="isEditMode && !showPasswordField" class="mb-3">
        <b-button
          variant="outline-info"
          size="sm"
          @click="showPasswordField = true"
          type="button"
        >
          <b-icon icon="key" class="mr-1"></b-icon>
          Change Password
        </b-button>
      </div>

      <!-- Role Field -->
      <b-form-group
        label="Role"
        label-for="user-role"
        :invalid-feedback="roleError"
        :state="roleState"
      >
        <b-form-select
          id="user-role"
          v-model="formData.role"
          :options="roleOptions"
          :state="roleState"
          @change="validateRole"
          required
        ></b-form-select>
      </b-form-group>

      <!-- Status Field -->
      <b-form-group label="Account Status" label-for="user-status">
        <b-form-checkbox
          id="user-status"
          v-model="formData.isActive"
          switch
          size="lg"
        >
          <span :class="formData.isActive ? 'text-success' : 'text-warning'">
            <b-icon
              :icon="formData.isActive ? 'check-circle' : 'x-circle'"
              class="mr-1"
            ></b-icon>
            {{ formData.isActive ? "Active" : "Inactive" }}
          </span>
        </b-form-checkbox>
        <small class="text-muted">
          {{
            formData.isActive
              ? "User can log in and access the system"
              : "User cannot log in"
          }}
        </small>
      </b-form-group>

      <!-- Form Actions -->
      <div class="form-actions mt-4 pt-3">
        <b-row>
          <b-col>
            <b-button
              type="submit"
              variant="primary"
              :disabled="!isFormValid || loading"
              class="mr-2"
            >
              <b-spinner v-if="loading" small class="mr-1"></b-spinner>
              <b-icon v-else icon="check" class="mr-1"></b-icon>
              {{ isEditMode ? "Update User" : "Create User" }}
            </b-button>
            <b-button
              variant="outline-secondary"
              @click="resetForm"
              :disabled="loading"
              type="button"
            >
              <b-icon icon="arrow-clockwise" class="mr-1"></b-icon>
              Reset
            </b-button>
          </b-col>
          <b-col class="text-right">
            <b-button
              variant="secondary"
              @click="closeModal"
              :disabled="loading"
              type="button"
            >
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </div>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: "UserFormModal",
  props: {
    modalId: {
      type: String,
      default: "user-form-modal",
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      showError: false,
      showSuccess: false,
      errorMessage: "",
      successMessage: "",
      showPassword: false,
      showPasswordField: false,
      formData: {
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      },
      // Validation states
      nameError: "",
      emailError: "",
      passwordError: "",
      roleError: "",
      nameState: null,
      emailState: null,
      passwordState: null,
      roleState: null,
      // Form options
      roleOptions: [
        { value: "user", text: "Standard User" },
        { value: "admin", text: "Administrator" },
      ],
    };
  },
  computed: {
    isFormValid() {
      const nameValid =
        this.nameState !== false && this.formData.name.trim() !== "";
      const emailValid =
        this.emailState !== false && this.formData.email.trim() !== "";
      const passwordValid =
        this.isEditMode ||
        (this.passwordState !== false && this.formData.password.trim() !== "");
      const roleValid = this.roleState !== false && this.formData.role !== "";

      return nameValid && emailValid && passwordValid && roleValid;
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (this.isEditMode && newUser) {
          this.populateForm();
        } else {
          this.resetForm();
        }
      },
    },
    isEditMode: {
      immediate: true,
      handler(newMode) {
        if (newMode && this.user) {
          this.populateForm();
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    onModalShow() {
      this.resetValidation();
      if (this.isEditMode && this.user) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    },
    onModalHidden() {
      this.resetForm();
      this.resetValidation();
      this.showPasswordField = false;
      this.$emit("modal-hidden");
    },
    populateForm() {
      this.formData = {
        name: this.user.name || "",
        email: this.user.email || "",
        password: "",
        role: this.user.role || "user",
        isActive: this.user.isActive !== undefined ? this.user.isActive : true,
      };
    },
    resetForm() {
      this.formData = {
        name: this.isEditMode ? this.user.name || "" : "",
        email: this.isEditMode ? this.user.email || "" : "",
        password: "",
        role: this.isEditMode ? this.user.role || "user" : "user",
        isActive: this.isEditMode
          ? this.user.isActive !== undefined
            ? this.user.isActive
            : true
          : true,
      };
      this.resetValidation();
      this.showPasswordField = false;
    },
    resetValidation() {
      this.nameState = null;
      this.emailState = null;
      this.passwordState = null;
      this.roleState = null;
      this.nameError = "";
      this.emailError = "";
      this.passwordError = "";
      this.roleError = "";
      this.showError = false;
      this.showSuccess = false;
    },
    validateName() {
      const name = this.formData.name.trim();
      if (!name) {
        this.nameError = "Name is required";
        this.nameState = false;
        return false;
      }
      if (name.length < 2) {
        this.nameError = "Name must be at least 2 characters";
        this.nameState = false;
        return false;
      }
      this.nameError = "";
      this.nameState = true;
      return true;
    },
    validateEmail() {
      const email = this.formData.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        this.emailError = "Email is required";
        this.emailState = false;
        return false;
      }
      if (!emailRegex.test(email)) {
        this.emailError = "Please enter a valid email address";
        this.emailState = false;
        return false;
      }
      this.emailError = "";
      this.emailState = true;
      return true;
    },
    validatePassword() {
      const password = this.formData.password;

      // Skip validation if in edit mode and password field is empty
      if (this.isEditMode && !password) {
        this.passwordState = null;
        this.passwordError = "";
        return true;
      }

      if (!password) {
        this.passwordError = "Password is required";
        this.passwordState = false;
        return false;
      }
      if (password.length < 6) {
        this.passwordError = "Password must be at least 6 characters";
        this.passwordState = false;
        return false;
      }
      this.passwordError = "";
      this.passwordState = true;
      return true;
    },
    validateRole() {
      if (!this.formData.role) {
        this.roleError = "Role is required";
        this.roleState = false;
        return false;
      }
      this.roleError = "";
      this.roleState = true;
      return true;
    },
    validateForm() {
      const nameValid = this.validateName();
      const emailValid = this.validateEmail();
      const passwordValid = this.validatePassword();
      const roleValid = this.validateRole();

      return nameValid && emailValid && passwordValid && roleValid;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        this.showError = true;
        this.errorMessage = "Please fix the form errors before submitting";
        return;
      }

      this.loading = true;
      this.showError = false;
      this.showSuccess = false;

      try {
        const submitData = { ...this.formData };

        // Remove password from submit data if in edit mode and password is empty
        if (this.isEditMode && !submitData.password) {
          delete submitData.password;
        }

        this.$emit("submit", {
          data: submitData,
          isEditMode: this.isEditMode,
          userId: this.isEditMode ? this.user._id : null,
        });

        this.showSuccess = true;
        this.successMessage = `User ${
          this.isEditMode ? "updated" : "created"
        } successfully!`;

        // Close modal after a brief delay
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      } catch (error) {
        this.showError = true;
        this.errorMessage =
          error.message ||
          `Failed to ${this.isEditMode ? "update" : "create"} user`;
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>

<style scoped>
.user-form {
  min-height: 300px;
}

.form-actions {
  background-color: #f8f9fa;
  padding: 1rem 1.25rem;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  border-top: 1px solid #dee2e6;
}

.form-group label {
  font-weight: 600;
  color: #495057;
}

.form-group small {
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .form-actions .btn {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    margin-bottom: 0.5rem;
  }

  .form-actions .btn:last-child {
    margin-bottom: 0;
  }
}
</style>
