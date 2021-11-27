<template>
  <div class="content-container">
    <div class="content-section">
      <h2>Short Film of the Month: False Memory</h2>
      <iframe
        id="youtube-embed"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/WPabB9vv_ks"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
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
      <NuxtLink :to="{ path: 'browse', query: { status: 3 } }"
        >View All</NuxtLink
      >
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
      <NuxtLink :to="{ path: 'browse', query: { status: 2 } }"
        >View All</NuxtLink
      >
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
    const featuredDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(sort:"totalPopularity:desc", where: { isFeatured: true })  {
                  id,
                  titles,
                  imageUrl,
                  status{name}
                },
              }`,
    })

    const featuredAiring = featuredDonghuas.data.data.donghuas.filter(
      (donghua) => donghua.status.name === 'RELEASING'
    )
    const featuredUpcoming = featuredDonghuas.data.data.donghuas.filter(
      (donghua) => donghua.status.name === 'NOT_YET_RELEASED'
    )

    const airingDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(limit: ${
                  10 - featuredAiring.length
                }, sort:"totalPopularity:desc", where: { status: {name: "RELEASING"} })  {
                  id,
                  titles,
                  imageUrl,
                },
              }`,
    })
    const upcomingDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(limit: ${
                  10 - featuredUpcoming.length
                }, sort:"totalPopularity:desc", where: { status: {name: "NOT_YET_RELEASED"}})  {
                  id,
                  titles,
                  imageUrl,
                },
              }`,
    })

    return {
      airingDonghuas: featuredAiring.concat(airingDonghuas.data.data.donghuas),
      upcomingDonghuas: featuredUpcoming.concat(
        upcomingDonghuas.data.data.donghuas
      ),
      featuredDonghuas: featuredDonghuas.data.data.donghuas.filter(
        (donghua) =>
          donghua.status.name !== 'RELEASING' &&
          donghua.status.name !== 'NOT_YET_RELEASED'
      ),
    }
  },
}
</script>

<style scoped>
#youtube-embed {
  max-width: 100%;
}
.content-section {
  margin-bottom: 50px;
}
.content-container {
  text-align: center;
}
.card-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
