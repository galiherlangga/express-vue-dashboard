<template>
  <div class="default-layout">
    <SidePanel @panel-toggled="onPanelToggled" />
    <div class="main-wrapper" :class="{ collapsed: isPanelCollapsed }">
      <Navbar />
      <main class="main-content">
        <div class="content-container">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import SidePanel from "../components/SidePanel.vue";

export default {
  name: "DefaultLayout",
  components: {
    Navbar,
    SidePanel,
  },
  data() {
    return {
      isPanelCollapsed: false,
    };
  },
  methods: {
    onPanelToggled(isCollapsed) {
      this.isPanelCollapsed = isCollapsed;
    },
  },
  mounted() {
    // Initialize panel state
    const saved = localStorage.getItem("sidePanelCollapsed");
    if (saved !== null) {
      this.isPanelCollapsed = saved === "true";
    }

    // Auto-collapse on mobile
    if (window.innerWidth <= 768) {
      this.isPanelCollapsed = true;
    }
  },
};
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  overflow-x: hidden;
}

.main-wrapper {
  flex: 1;
  margin-left: 260px;
  width: calc(100% - 260px);
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-wrapper.collapsed {
  margin-left: 60px;
  width: calc(100% - 60px);
}

.main-content {
  flex: 1;
  background-color: #f8f9fa;
  overflow-x: auto;
}

.content-container {
  padding: 0;
  min-height: calc(100vh - 56px);
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0;
  }

  .main-wrapper.collapsed {
    margin-left: 0;
  }
}
</style>
