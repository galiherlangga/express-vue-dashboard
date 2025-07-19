import { shallowMount, createLocalVue } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import VueRouter from "vue-router";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";

// Mock axios
jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(BootstrapVue);

describe("Login.vue", () => {
  let wrapper;
  let router;

  beforeEach(() => {
    router = new VueRouter({
      mode: "abstract",
      routes: [
        { path: "/login", name: "Login" },
        { path: "/dashboard", name: "Dashboard" },
      ],
    });

    wrapper = shallowMount(Login, {
      localVue,
      router,
      stubs: {
        "b-container": true,
        "b-row": true,
        "b-col": true,
        "b-card": true,
        "b-card-body": true,
        "b-form": true,
        "b-form-group": true,
        "b-form-input": true,
        "b-form-checkbox": true,
        "b-button": true,
        "b-alert": true,
        "b-icon": true,
        "b-spinner": true,
        "b-link": true,
        "b-form-invalid-feedback": true,
      },
    });
  });

  afterEach(() => {
    if (wrapper && wrapper.destroy) {
      wrapper.destroy();
    }
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it("initializes with correct data", () => {
    expect(wrapper.vm.form.email).toBe("");
    expect(wrapper.vm.form.password).toBe("");
    expect(wrapper.vm.form.rememberMe).toBe(false);
    expect(wrapper.vm.showPassword).toBe(false);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.showAlert).toBe(false);
  });

  it("validates email format correctly", () => {
    // Test with empty email
    wrapper.vm.form.email = "";
    expect(wrapper.vm.emailState).toBe(null);

    // Test with invalid email
    wrapper.vm.form.email = "invalid-email";
    expect(wrapper.vm.emailState).toBe(false);

    // Test with valid email
    wrapper.vm.form.email = "test@example.com";
    expect(wrapper.vm.emailState).toBe(true);
  });

  it("validates password length correctly", () => {
    // Test with empty password
    wrapper.vm.form.password = "";
    expect(wrapper.vm.passwordState).toBe(null);

    // Test with short password
    wrapper.vm.form.password = "123";
    expect(wrapper.vm.passwordState).toBe(false);

    // Test with valid password
    wrapper.vm.form.password = "password123";
    expect(wrapper.vm.passwordState).toBe(true);
  });

  it("has working reset method", () => {
    // Set some form data
    wrapper.vm.form.email = "test@example.com";
    wrapper.vm.form.password = "password123";
    wrapper.vm.form.rememberMe = true;
    wrapper.vm.showPassword = true;
    wrapper.vm.showAlert = true;

    // Call reset with mock event
    const mockEvent = { preventDefault: jest.fn() };
    wrapper.vm.onReset(mockEvent);

    // Check that form is reset
    expect(wrapper.vm.form.email).toBe("");
    expect(wrapper.vm.form.password).toBe("");
    expect(wrapper.vm.form.rememberMe).toBe(false);
    expect(wrapper.vm.showPassword).toBe(false);
    expect(wrapper.vm.showAlert).toBe(false);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it("shows alert messages correctly", () => {
    wrapper.vm.showAlertMessage("Test message", "success");

    expect(wrapper.vm.alertMessage).toBe("Test message");
    expect(wrapper.vm.alertVariant).toBe("success");
    expect(wrapper.vm.showAlert).toBe(true);
  });

  it("prevents form submission with invalid data", async () => {
    const mockEvent = { preventDefault: jest.fn() };

    // Set invalid email
    wrapper.vm.form.email = "invalid-email";
    wrapper.vm.form.password = "validpassword";

    await wrapper.vm.onSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(wrapper.vm.showAlert).toBe(true);
    expect(wrapper.vm.alertVariant).toBe("danger");
  });

  it("has isValidEmail method working correctly", () => {
    expect(wrapper.vm.isValidEmail("test@example.com")).toBe(true);
    expect(wrapper.vm.isValidEmail("invalid-email")).toBe(false);
    expect(wrapper.vm.isValidEmail("user@domain")).toBe(false);
    expect(wrapper.vm.isValidEmail("user@domain.co.uk")).toBe(true);
  });

  it("handles successful login", async () => {
    const mockResponse = {
      data: { token: "test-token" },
    };
    axios.post.mockResolvedValue(mockResponse);

    // Set valid form data
    wrapper.vm.form.email = "test@example.com";
    wrapper.vm.form.password = "password123";

    const mockEvent = { preventDefault: jest.fn() };

    // Mock router push
    const pushSpy = jest
      .spyOn(wrapper.vm.$router, "push")
      .mockImplementation(() => {});

    await wrapper.vm.onSubmit(mockEvent);

    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "test@example.com",
      password: "password123",
      rememberMe: false,
    });

    // Check that token is stored
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");

    pushSpy.mockRestore();
  });

  it("handles login error", async () => {
    const mockError = {
      response: {
        data: { message: "Invalid credentials" },
      },
    };
    axios.post.mockRejectedValue(mockError);

    // Set valid form data
    wrapper.vm.form.email = "test@example.com";
    wrapper.vm.form.password = "wrongpassword";

    const mockEvent = { preventDefault: jest.fn() };

    await wrapper.vm.onSubmit(mockEvent);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showAlert).toBe(true);
    expect(wrapper.vm.alertVariant).toBe("danger");
    expect(wrapper.vm.alertMessage).toBe("Invalid credentials");
  });
});
