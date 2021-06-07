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
    const airingDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(limit: 10, where: { status: {name: "RELEASING"} })  {
                  id,
                  titles,
                  image{url},
                },
              }`,
    })
    const upcomingDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(limit: 10, where: { status: {name: "NOT_YET_RELEASED"}})  {
                  id,
                  titles,
                  image{url},
                },
              }`,
    })
    const featuredDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(limit: 10, where: { isFeatured: true })  {
                  id,
                  titles,
                  image{url},
                },
              }`,
    })
    return {
      airingDonghuas: airingDonghuas.data.data.donghuas,
      upcomingDonghuas: upcomingDonghuas.data.data.donghuas,
      featuredDonghuas: featuredDonghuas.data.data.donghuas,
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
  flex-wrap: wrap;
  justify-content: center;
}
</style>
