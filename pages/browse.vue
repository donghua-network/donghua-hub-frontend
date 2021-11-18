<template>
  <div>
    <div>
      <a-form class="search-form" :colon="false">
        <a-row :gutter="5">
          <a-col :md="4">
            <a-form-item label="Search" class="search-form-item">
              <a-input v-model="filters.query" @change="onSearch" />
            </a-form-item>
          </a-col>
          <a-col :md="4">
            <a-form-item label="Genre" class="search-form-item">
              <a-select mode="multiple" @change="genresChanged">
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
              <a-select mode="tags" @change="tagsChanged">
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
              <a-select mode="multiple" @change="statusesChanged">
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
              <a-select mode="multiple" @change="formatsChanged">
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
              <a-select default-value="popularity-desc" @change="sortChanged">
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

    const allDonghuas = await $axios.post('/graphql', {
      query: `{
                donghuas(sort:"totalPopularity:desc")  {
                  id,
                  titles,
                  image{url},
                  status{id},
                  tags{id},
                  genres{id},
                  media_type{id},
                  totalPopularity,
                  aggregateScore
                },
              }`,
    })
    for (const donghua of allDonghuas.data.data.donghuas) {
      donghua.id = parseInt(donghua.id)
      donghua.status = parseInt(donghua.status.id)
      donghua.media_type = parseInt(donghua.media_type.id)
      donghua.genres = donghua.genres.map((genre) => parseInt(genre.id))
      donghua.tags = donghua.tags.map((tag) => parseInt(tag.id))
    }

    return {
      genres,
      tags,
      statuses,
      formats,
      donghuas: allDonghuas.data.data.donghuas,
      filters: {
        genres: new Set(),
        tags: new Set(),
        formats: new Set(),
        statuses: new Set(),
        query: '',
      },
      sort: 'popularity-desc',
      pageNumber: 1,
      pageSize: 50,
    }
  },

  mounted() {
    if (this.$route.query.q) {
      this.filters.query = this.$route.query.q
    }
  },

  computed: {
    displayedDonghuas() {
      return this.donghuas
        .filter((donghua) => {
          if (this.filters.query !== null && this.filters.query !== '') {
            let matchesQuery = false
            for (const title of Object.values(donghua.titles)) {
              if (title.toLowerCase().includes(this.filters.query)) {
                matchesQuery = true
                break
              }
            }
            if (!matchesQuery) {
              return false
            }
          }

          if (this.filters.genres.size > 0) {
            let hasGenre = false
            for (const genre of donghua.genres) {
              if (this.filters.genres.has(genre)) {
                hasGenre = true
                break
              }
            }
            if (!hasGenre) {
              return false
            }
          }

          if (this.filters.tags.size > 0) {
            let hasTag = false
            for (const tag of donghua.tags) {
              if (this.filters.tags.has(tag)) {
                hasTag = true
                break
              }
            }
            if (!hasTag) {
              return false
            }
          }

          if (this.filters.formats.size > 0) {
            if (!this.filters.formats.has(donghua.media_type)) {
              return false
            }
          }

          if (this.filters.statuses.size > 0) {
            if (!this.filters.statuses.has(donghua.status)) {
              return false
            }
          }
          return true
        })
        .sort((a, b) => {
          switch (this.sort) {
            case 'popularity-desc':
              return b.totalPopularity - a.totalPopularity
            case 'score-desc':
              return b.score - a.score
          }
        })
    },
  },

  methods: {
    onSearch() {
      this.pageNumber = 1
    },

    sortChanged(value) {
      console.log(value)
      this.sort = value
    },

    genresChanged(values) {
      this.filters.genres = new Set(values.map((value) => parseInt(value)))
      this.pageNumber = 1
    },

    tagsChanged(values) {
      this.filters.tags = new Set(values.map((value) => parseInt(value)))
      this.pageNumber = 1
    },

    statusesChanged(values) {
      this.filters.statuses = new Set(values.map((value) => parseInt(value)))
      this.pageNumber = 1
    },

    formatsChanged(values) {
      this.filters.formats = new Set(values.map((value) => parseInt(value)))
      this.pageNumber = 1
    },
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
