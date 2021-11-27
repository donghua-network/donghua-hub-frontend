<template>
  <div>
    <div>
      <a-form class="search-form" :colon="false">
        <a-row :gutter="5">
          <a-col :md="4">
            <a-form-item label="Search" class="search-form-item">
              <a-input v-model="query" @change="resetPage" />
            </a-form-item>
          </a-col>
          <a-col :md="4">
            <a-form-item label="Genre" class="search-form-item">
              <a-select
                v-model="selectedGenres"
                mode="multiple"
                @change="resetPage"
              >
                <a-select-option
                  v-for="(genre, id) in genres"
                  :key="id"
                  :value="id"
                >
                  {{ genre }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4">
            <a-form-item label="Tag" class="search-form-item">
              <a-select v-model="selectedTags" mode="tags" @change="resetPage">
                <a-select-option
                  v-for="(tag, id) in tags"
                  :key="id"
                  :value="id"
                >
                  {{ tag }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4">
            <a-form-item label="Status" class="search-form-item">
              <a-select
                v-model="selectedStatuses"
                mode="multiple"
                @change="resetPage"
              >
                <a-select-option
                  v-for="(status, id) in statuses"
                  :key="id"
                  :value="id"
                >
                  {{ status }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4">
            <a-form-item label="Format" class="search-form-item">
              <a-select
                v-model="selectedFormats"
                mode="multiple"
                @change="resetPage"
              >
                <a-select-option
                  v-for="(format, id) in formats"
                  :key="id"
                  :value="id"
                >
                  {{ format }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4">
            <a-form-item label="Sort By" class="search-form-item">
              <a-select v-model="selectedSort">
                <a-select-option value="popularity-desc"
                  >Most Popular</a-select-option
                >
                <a-select-option value="score-desc"
                  >Highest Score</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="results-container">
      <a-pagination
        v-model="pageNumber"
        :page-size="pageSize"
        :total="displayedDonghuas.length"
      />
      <div class="card-container">
        <donghua-card
          v-for="donghua in displayedDonghuas.slice(
            (pageNumber - 1) * pageSize,
            pageNumber * pageSize
          )"
          :key="donghua.id"
          :donghua="donghua"
        ></donghua-card>
      </div>
      <a-pagination
        v-model="pageNumber"
        :page-size="pageSize"
        :total="displayedDonghuas.length"
      />
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios }) {
    const allGenres = await $axios.post('/graphql', {
      query: `{
                genres {
                  id,
                  name
                }
              }`,
    })
    const genres = {}
    allGenres.data.data.genres.forEach(
      (genre) => (genres[genre.id] = genre.name)
    )

    const allTags = await $axios.post('/graphql', {
      query: `{
                tags {
                  id,
                  name
                }
              }`,
    })
    const tags = {}
    allTags.data.data.tags.forEach((tag) => (tags[tag.id] = tag.name))

    const allStatuses = await $axios.post('/graphql', {
      query: `{
                statuses {
                  id,
                  name
                }
              }`,
    })
    const statuses = {}
    allStatuses.data.data.statuses.forEach(
      (status) => (statuses[status.id] = status.name)
    )

    const allFormats = await $axios.post('/graphql', {
      query: `{
                mediaTypes {
                  id,
                  name
                }
              }`,
    })
    const formats = {}
    allFormats.data.data.mediaTypes.forEach(
      (format) => (formats[format.id] = format.name)
    )

    const numDonghuas = await $axios
      .get('/donghuas/count')
      .then((res) => res.data)
    let allDonghuas = await $axios
      .post('/graphql', {
        query: `{
                donghuas(sort:"totalPopularity:desc")  {
                  id,
                  titles,
                  imageUrl,
                  status{id},
                  tags{id},
                  genres{id},
                  media_type{id},
                  totalPopularity,
                  aggregateScore
                },
              }`,
      })
      .then((res) => res.data.data.donghuas)
    while (allDonghuas.length < numDonghuas) {
      allDonghuas = allDonghuas.concat(
        await $axios
          .post('/graphql', {
            query:
              `{
                donghuas(sort:"totalPopularity:desc", start:` +
              allDonghuas.length +
              `)  {
                  id,
                  titles,
                  imageUrl,
                  status{id},
                  tags{id},
                  genres{id},
                  media_type{id},
                  totalPopularity,
                  aggregateScore
                },
              }`,
          })
          .then((res) => res.data.data.donghuas)
      )
    }
    for (const donghua of allDonghuas) {
      donghua.id = parseInt(donghua.id)
      if (donghua.status) {
        donghua.status = parseInt(donghua.status.id)
      }
      if (donghua.media_type) {
        donghua.media_type = parseInt(donghua.media_type.id)
      }
      donghua.genres = donghua.genres.map((genre) => parseInt(genre.id))
      donghua.tags = donghua.tags.map((tag) => parseInt(tag.id))
    }

    return {
      genres,
      tags,
      statuses,
      formats,
      donghuas: allDonghuas,
      pageNumber: 1,
      pageSize: 50,
    }
  },

  computed: {
    query: {
      get() {
        return this.$route.query.q
      },
      set(value) {
        this.updateQueryParams('q', value)
      },
    },
    selectedGenres: {
      get() {
        return this.$route.query.genre
      },
      set(value) {
        this.updateQueryParams('genre', value)
      },
    },
    selectedTags: {
      get() {
        return this.$route.query.tag
      },
      set(value) {
        this.updateQueryParams('tag', value)
      },
    },
    selectedStatuses: {
      get() {
        return this.$route.query.status
      },
      set(value) {
        this.updateQueryParams('status', value)
      },
    },
    selectedFormats: {
      get() {
        return this.$route.query.format
      },
      set(value) {
        this.updateQueryParams('format', value)
      },
    },
    selectedSort: {
      get() {
        return this.$route.query.sort
          ? this.$route.query.sort
          : 'popularity-desc'
      },
      set(value) {
        this.updateQueryParams('sort', value)
      },
    },
    displayedDonghuas() {
      return this.donghuas
        .filter((donghua) => {
          if (this.query && this.query !== '') {
            let matchesQuery = false
            for (const title of Object.values(donghua.titles)) {
              if (title && title.toLowerCase().includes(this.query)) {
                matchesQuery = true
                break
              }
            }
            if (!matchesQuery) {
              return false
            }
          }

          if (this.selectedGenres && this.selectedGenres.length > 0) {
            let hasGenre = false
            for (const genre of donghua.genres) {
              if (this.selectedGenres.includes('' + genre)) {
                hasGenre = true
                break
              }
            }
            if (!hasGenre) {
              return false
            }
          }

          if (this.selectedTags && this.selectedTags.length > 0) {
            let hasTag = false
            for (const tag of donghua.tags) {
              if (this.selectedTags.includes('' + tag)) {
                hasTag = true
                break
              }
            }
            if (!hasTag) {
              return false
            }
          }

          if (this.selectedFormats && this.selectedFormats.length > 0) {
            if (
              !donghua.media_type ||
              !this.selectedFormats.includes('' + donghua.media_type)
            ) {
              return false
            }
          }

          if (this.selectedStatuses && this.selectedStatuses.length > 0) {
            if (
              !donghua.status ||
              !this.selectedStatuses.includes('' + donghua.status)
            ) {
              return false
            }
          }
          return true
        })
        .sort((a, b) => {
          switch (this.selectedSort) {
            case 'popularity-desc':
              return b.totalPopularity - a.totalPopularity
            case 'score-desc':
              return b.aggregateScore - a.aggregateScore
          }
        })
    },
  },

  methods: {
    resetPage() {
      this.pageNumber = 1
    },

    updateQueryParams(queryParam, value) {
      const newQueryParams = { ...this.$route.query }
      newQueryParams[queryParam] = value
      this.$router.replace({
        query: newQueryParams,
      })
    },
  },
  head() {
    const shortDescription = 'Search through hundreds of donghua on DonghuaHub!'
    return {
      title: 'Browse Donghua',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: shortDescription,
        },
        {
          hid: 'og-url',
          property: 'og:url',
          content: 'https://donghuahub.com/browse',
        },
        {
          hid: 'og-type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og-title',
          property: 'og:title',
          content: 'Browse Donghua',
        },
        {
          hid: 'og-description',
          property: 'og:description',
          content: shortDescription,
        },
        {
          hid: 'og-image',
          property: 'og:image',
          content: 'https://donghuahub.com/logo_large.png',
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
.search-form-item {
  margin: 0;
}
.search-form {
  max-width: 1280px;
  margin: 0 auto;
}
.results-container {
  text-align: center;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0 20px 0;
}
</style>
