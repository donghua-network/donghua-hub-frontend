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
              <b>External Database Links:</b>
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
              <b>Format: </b
              ><span>{{
                donghua.media_type ? donghua.media_type.name : ''
              }}</span>
            </div>
            <div>
              <b>Episodes: </b><span>{{ donghua.numEpisodes }}</span>
            </div>
            <div>
              <b>Episode Duration: </b
              ><span>{{ donghua.duration }} minutes</span>
            </div>
            <div>
              <b>Status: </b
              ><span>{{ donghua.status ? donghua.status.name : '' }}</span>
            </div>
            <div>
              <b>Start Date: </b><span>{{ donghua.startDate }}</span>
            </div>
            <div>
              <b>End Date: </b><span>{{ donghua.endDate }}</span>
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
                  .filter((title) => title != '')
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
                  relatedWorks,
                  studios{id,name},
                  status{id,name},
                  startDate,
                  endDate,
                  numEpisodes,
                  media_type{id,name},
                  duration
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
    const shortDescription = this.donghua.description
      ? this.donghua.description.split('.', 2).join('.') + '...'
      : ''
    return {
      title: this.donghua.titles.romanized,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: shortDescription,
        },
        {
          hid: 'og-url',
          property: 'og:url',
          content: 'https://donghuahub.com/donghuas/' + this.donghua.id,
        },
        {
          hid: 'og-type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og-title',
          property: 'og:title',
          content: this.donghua.titles.romanized,
        },
        {
          hid: 'og-description',
          property: 'og:description',
          content: shortDescription,
        },
        {
          hid: 'og-image',
          property: 'og:image',
          content: this.donghua.imageUrl,
        },
        {
          hid: 'twitter-card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
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
