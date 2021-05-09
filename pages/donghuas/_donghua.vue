<template>
  <div class="main-content">
    <div class="page-details-container">
      <a-row gutter="24">
        <a-col :xs="{ span: 24 }" :md="{ span: 8 }" :lg="{ span: 6 }"
          ><img class="page-image" :src="donghua.image"
        /></a-col>
        <a-col :xs="{ span: 24 }" :md="{ span: 16 }" :lg="{ span: 18 }">
          <div>
            <h2>{{ donghua.title }}</h2>
            <div>{{ donghua.description }}</div>
            <div>
              <h3>Genres:</h3>
              <a-tag v-for="genre in donghua.genres" :key="genre">{{
                genre.name
              }}</a-tag>
            </div>
            <div>
              <h3>Tags:</h3>
              <a-tag v-for="tag in donghua.tags" :key="tag">{{
                tag.name
              }}</a-tag>
            </div>
            <div>
              <h3>Popularity:</h3>
              <p v-for="popularity in donghua.popularity" :key="popularity">
                {{ popularity.platform }}:
                <a-tag>{{ popularity.numUsers }}</a-tag>
              </p>
            </div>
            <div>
              <h3>Score:</h3>
              <p v-for="score in donghua.score" :key="score">
                {{ score.platform }}:
                <a-tag>{{ score.score }}</a-tag>
              </p>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Media"></a-tab-pane>
        <a-tab-pane key="2" tab="Related Works"></a-tab-pane>
        <a-tab-pane key="3" tab="Staff">
          <h4 v-for="staff in staffs" :key="staff">{{ staff.name }}</h4>
        </a-tab-pane>
      </a-tabs>
      <Disqus />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const donghuaId = params.donghua
    const donghua = await $axios.post('/graphql', {
      query: `{
                 donghua(id:${donghuaId}){
                  title,
                  description,
                  genres{
                   name,
                  },
                  tags{
                   name,
                  },
                  image{
                   url,
                  },
                  popularity,
                  score
                 },
              }`,
    })
    const staffs = await $axios.post('/graphql', {
      query: `{
                staffRoles(where:{donghua:{id:${donghuaId}}}){
                  name
                },
              }`,
    })
    return {
      donghua: donghua.data.data.donghua,
      staffs: staffs.data.data.staffRoles,
    }
  },

  head() {
    return {
      title: this.donghua.title,
    }
  },
}
</script>

<style>
.main-content {
  display: flex;
  justify-content: center;
  padding: 50px;
}
.page-details-container {
  max-width: 1280px;
}
.page-image {
  width: 100%;
}
</style>
