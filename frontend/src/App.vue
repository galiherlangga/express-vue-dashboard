<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Global styles to prevent overflow issues */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scroll on body */
}

* {
  box-sizing: border-box; /* Ensure consistent box model */
}

/* Ensure Bootstrap containers don't cause overflow */
.container-fluid {
  max-width: 100%;
  overflow-x: auto;
}

</style>
