<template>
  <div class="main-content">
    <div class="page-details-container">
      <a-row gutter="24">
        <a-col :xs="{ span: 24 }" :md="{ span: 8 }" :lg="{ span: 6 }"
          ><img class="page-image" :src="donghua.image"
        /></a-col>
        <a-col :xs="{ span: 24 }" :md="{ span: 16 }" :lg="{ span: 18 }">
          <div>
            <h2>{{ donghua.titles.romanized }}</h2>
            <div>{{ donghua.description }}</div>
            <div>
              Genres:
              <a-tag v-for="genre in donghua.genres" :key="genre">{{
                genre.name
              }}</a-tag>
            </div>
            <div>
              Tags:
              <a-tag v-for="tag in donghua.tags" :key="tag">{{
                tag.name
              }}</a-tag>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Media"></a-tab-pane>
        <a-tab-pane key="2" tab="Related Works"></a-tab-pane>
        <a-tab-pane key="3" tab="Staff"></a-tab-pane>
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
                  titles,
                  description,
                  genres{
                   name,
                  },
                  tags{
                   name,
                  }
                  image{
                   url,
                  }
                 },
              }`,
    })
    return {
      donghua: donghua.data.data.donghua,
    }
  },

  head() {
    return {
      title: this.donghua.titles.romanized,
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
