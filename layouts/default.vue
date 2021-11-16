<template>
  <div>
    <Header :titles-map="titlesMap" />
    <div class="main-content">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>
<script>
export default {
  data() {
    return {
      titlesMap: null,
    }
  },
  async mounted() {
    this.titlesMap = await fetch(
      window.location.origin + '/titleIndex.json'
    ).then((res) => res.json())
  },
}
</script>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
body {
  background-color: #f9f9f9;
}
.main-content {
  padding: 20px;
}
</style>
