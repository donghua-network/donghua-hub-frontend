<template>
  <div class="content-container">
    <div class="content-section">
      <h2>Featured</h2>
      <div class="card-container">
        <donghua-card
          v-for="donghua in featuredDonghuas"
          :key="donghua.id"
          :donghua="donghua"
        ></donghua-card>
      </div>
    </div>
    <div class="content-section">
      <h2>Currently Airing</h2>
      <div class="card-container">
        <donghua-card
          v-for="donghua in airingDonghuas"
          :key="donghua.id"
          :donghua="donghua"
        ></donghua-card>
      </div>
    </div>
    <div class="content-section">
      <h2>Upcoming Releases</h2>
      <div class="card-container">
        <donghua-card
          v-for="donghua in upcomingDonghuas"
          :key="donghua.id"
          :donghua="donghua"
        ></donghua-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const airingDonghuas = await $axios.get('/donghuas?isAiring=true')
    const upcomingDonghuas = await $axios.get(
      '/donghuas?_where[0][isAiring]=false&_where[1][startDate_gt]=' +
        new Date().toISOString()
    )
    const featuredDonghuas = await $axios.get('/donghuas?isFeatured=true')
    return {
      airingDonghuas: airingDonghuas.data,
      upcomingDonghuas: upcomingDonghuas.data,
      featuredDonghuas: featuredDonghuas.data,
    }
  },
}
</script>

<style scoped>
.content-section {
  margin-bottom: 50px;
}
.content-container {
  text-align: center;
  padding: 20px;
}
.card-container {
  display: flex;
  justify-content: center;
}
</style>
