<template>
  <div class="main-content">
    <div class="page-details-container">
      <a-row :gutter="24">
        <a-col :xs="{ span: 24 }" :md="{ span: 8 }" :lg="{ span: 6 }"
          ><img class="page-image" :src="donghua.imageUrl"
        /></a-col>
        <a-col :xs="{ span: 24 }" :md="{ span: 16 }" :lg="{ span: 18 }">
          <div>
            <h2>{{ donghua.titles.romanized }}</h2>
            <div>{{ donghua.description }}</div>
            <br />
            <div>
              <b>External Links:</b>
              <a
                v-if="donghua.externalSiteIds.anilist"
                :href="
                  'https://anilist.co/anime/' + donghua.externalSiteIds.anilist
                "
                >AniList</a
              >
            </div>
            <div>
              <b>Genres:</b>
              <a-tag v-for="genre in donghua.genres" :key="genre">{{
                genre.name
              }}</a-tag>
            </div>
            <div>
              <b>Tags:</b>
              <a-tag v-for="tag in donghua.tags" :key="tag">{{
                tag.name
              }}</a-tag>
            </div>
            <div>
              <b>Popularity:</b>
              <span
                v-for="popularity in Object.entries(donghua.popularity)"
                :key="popularity[0]"
              >
                {{ popularity[0] }}:
                <a-tag>{{ popularity[1] }}</a-tag>
              </span>
            </div>
            <div>
              <b>Score:</b>
              <span
                v-for="score in Object.entries(donghua.score)"
                :key="score[0]"
              >
                {{ score[0] }}:
                <a-tag>{{ score[1] }}</a-tag>
              </span>
            </div>
            <div>
              <b>Studios:</b>
              {{ donghua.studios.map((studio) => studio.name).join(', ') }}
            </div>
            <div>
              <b>Titles:</b>
              {{
                Object.values(donghua.titles)
                  .concat(donghua.alternativeTitles)
                  .join(', ')
              }}
            </div>
          </div>
        </a-col>
      </a-row>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Media">
          <h3>Trailers</h3>
          <div>
            <div v-for="trailer in donghua.trailers" :key="trailer">
              <iframe
                v-if="trailer.youtube"
                width="560"
                height="315"
                style="max-width: 100%"
                :src="'https://www.youtube.com/embed/' + trailer.youtube"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <br />
          <h3>Official Links/Streams</h3>
          <div>
            <p
              v-for="stream in Object.entries(donghua.streams)"
              :key="stream[0]"
            >
              <a :href="stream[1]">{{ stream[0] }}</a>
            </p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Related Works">
          <div class="related">
            <div v-for="work in relatedWorks" :key="work">
              <h3 class="relation-name">
                {{ work.relationName }}
              </h3>
              <donghua-card :donghua="work.relatedDonghua"> </donghua-card>
            </div>
          </div>
        </a-tab-pane>
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
import DonghuaCard from '~/components/DonghuaCard.vue'
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
  components: { DonghuaCard },
  async asyncData({ $axios, params }) {
    const donghuaId = params.donghua
    const donghua = await $axios
      .post('/graphql', {
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
                  imageUrl,
                  popularity,
                  score,
                  trailers,
                  streams,
                  externalSiteIds,
                  alternativeTitles,
                  studios{id,name}
                  relatedWorks
                 },
              }`,
      })
      .then((res) => res.data.data.donghua)
    const staffTableData = await $axios
      .post('/graphql', {
        query: `{
                staffRoles(where:{donghua:{id:${donghuaId}}}){
                  name,
                  person{name}
                },
              }`,
      })
      .then((res) => res.data.data.staffRoles)

    const relatedDonghuaArr = []

    for (const [relatedKey, relatedID] of Object.entries(
      donghua.relatedWorks
    )) {
      const newDonghua = await $axios
        .post('/graphql', {
          query: `{
                 donghua(id:${relatedID}){
                  id,
                  titles,
                  imageUrl,
                 },
              }`,
        })
        .then((res) => res.data.data.donghua)
      relatedDonghuaArr.push({
        relationName: relatedKey,
        relatedDonghua: newDonghua,
      })
    }

    return {
      donghua,
      relatedWorks: relatedDonghuaArr,
      staffTableData,
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

<style scoped>
.main-content {
  display: flex;
  justify-content: center;
}
.page-details-container {
  max-width: 1280px;
}
.page-image {
  width: 100%;
}
.related {
  display: flex;
  padding: 5px;
  flex-flow: row wrap;
}
.relation-name {
  text-align: center;
}
</style>
