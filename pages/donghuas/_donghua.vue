<template>
  <div class="main-content">
    <div class="page-details-container">
      <a-row gutter="24">
        <a-col :xs="{ span: 24 }" :md="{ span: 8 }" :lg="{ span: 6 }"
          ><img class="page-image" :src="donghua.image.url"
        /></a-col>
        <a-col :xs="{ span: 24 }" :md="{ span: 16 }" :lg="{ span: 18 }">
          <div>
            <h2>{{ donghua.titles.romanized }}</h2>
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
              <p
                v-for="popularity in Object.entries(donghua.popularity)"
                :key="popularity[0]"
              >
                {{ popularity[0] }}:
                <a-tag>{{ popularity[1] }}</a-tag>
              </p>
            </div>
            <div>
              <h3>Score:</h3>
              <p v-for="score in Object.entries(donghua.score)" :key="score[0]">
                {{ score[0] }}:
                <a-tag>{{ score[1] }}</a-tag>
              </p>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Media"></a-tab-pane>
        <a-tab-pane key="2" tab="Related Works"></a-tab-pane>
        <a-tab-pane key="3" tab="Staff">
          <a-table
            :columns="staffTableColumns"
            :data-source="staffTableData"
            bordered
          ></a-table>
        </a-tab-pane>
      </a-tabs>
      <Disqus />
    </div>
  </div>
</template>

<script>
const staffTableColumns = [
  {
    title: 'Role',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Name',
    dataIndex: 'person.name',
    key: 'person.name',
  },
]
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
                  },
                  image{
                   url,
                  },
                  popularity,
                  score
                 },
              }`,
    })
    const staffRoles = await $axios.post('/graphql', {
      query: `{
                staffRoles(where:{donghua:{id:${donghuaId}}}){
                  name,
                  person{name}
                },
              }`,
    })
    return {
      donghua: donghua.data.data.donghua,
      staffTableData: staffRoles.data.data.staffRoles,
    }
  },
  data() {
    return {
      staffTableData: [],
      staffTableColumns,
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
