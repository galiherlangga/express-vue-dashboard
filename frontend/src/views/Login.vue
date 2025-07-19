<template>
  <div class="login-container">
    <div class="container-fluid vh-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h3 class="card-title text-primary">
                  <b-icon icon="person-circle" font-scale="2" class="mb-2"></b-icon>
                  <br>
                  Welcome Back
                </h3>
                <p class="text-muted">Please sign in to your account</p>
              </div>
              
              <b-form @submit="onSubmit" @reset="onReset">
                <b-form-group
                  id="input-group-email"
                  label="Email address"
                  label-for="input-email"
                  class="mb-3"
                >
                  <b-form-input
                    id="input-email"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    :state="emailState"
                    size="lg"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="emailState">
                    Please enter a valid email address.
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group
                  id="input-group-password"
                  label="Password"
                  label-for="input-password"
                  class="mb-3"
                >
                  <b-form-input
                    id="input-password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
                    required
                    :state="passwordState"
                    size="lg"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="passwordState">
                    Password must be at least 6 characters long.
                  </b-form-invalid-feedback>
                </b-form-group>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <b-form-checkbox
                    id="checkbox-remember"
                    v-model="form.rememberMe"
                    name="checkbox-remember"
                  >
                    Remember me
                  </b-form-checkbox>
                  
                  <b-form-checkbox
                    id="checkbox-show-password"
                    v-model="showPassword"
                    name="checkbox-show-password"
                  >
                    Show password
                  </b-form-checkbox>
                </div>

                <b-button
                  type="submit"
                  variant="primary"
                  size="lg"
                  class="w-100 mb-3"
                  :disabled="loading"
                >
                  <b-spinner small v-if="loading" class="mr-2"></b-spinner>
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </b-button>

                <div class="text-center">
                  <b-link href="#" class="text-muted">
                    Forgot your password?
                  </b-link>
                </div>
              </b-form>

              <b-alert
                v-model="showAlert"
                :variant="alertVariant"
                dismissible
                class="mt-3"
              >
                {{ alertMessage }}
              </b-alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login-page",
  data() {
    return {
      form: {
        email: "",
        password: "",
        rememberMe: false,
      },
      showPassword: false,
      loading: false,
      showAlert: false,
      alertMessage: "",
      alertVariant: "danger",
    };
  },
  computed: {
    emailState() {
      return this.form.email.length > 0
        ? this.isValidEmail(this.form.email)
        : null;
    },
    passwordState() {
      return this.form.password.length > 0
        ? this.form.password.length >= 6
        : null;
    },
  },
  methods: {
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async onSubmit(event) {
      event.preventDefault();

      // Validate form
      if (!this.emailState || !this.passwordState) {
        this.showAlertMessage("Please fill in all fields correctly.", "danger");
        return;
      }

      this.loading = true;
      this.showAlert = false;

      try {
        // Make API call to backend
        const response = await axios.post("/api/auth/login", {
          email: this.form.email,
          password: this.form.password,
          rememberMe: this.form.rememberMe,
        });

        // Store token and user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Show success message
        this.showAlertMessage("Login successful! Redirecting...", "success");

        // Redirect to dashboard
        setTimeout(() => {
          this.$router.push("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        this.showAlertMessage(errorMessage, "danger");
      } finally {
        this.loading = false;
      }
    },
    onReset(event) {
      event.preventDefault();
      this.form.email = "";
      this.form.password = "";
      this.form.rememberMe = false;
      this.showPassword = false;
      this.showAlert = false;
    },
    showAlertMessage(message, variant) {
      this.alertMessage = message;
      this.alertVariant = variant;
      this.showAlert = true;
    },
  },
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
}

.card-body {
  background: white;
  border-radius: 15px;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.form-control {
  border-radius: 10px;
  border: 1px solid #e3e6f0;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
</style>
