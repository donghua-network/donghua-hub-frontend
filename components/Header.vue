<template>
  <div id="menu-bar">
    <a-row>
      <a-col :md="6" :lg="5" :xxl="4">
        <NuxtLink to="/"><img src="~/assets/banner_logo.png" /></NuxtLink>
      </a-col>
      <a-col :md="14" :lg="16" :xxl="18">
        <NuxtLink to="/browse"
          ><a-button type="link">Browse</a-button></NuxtLink
        >
        <div class="search-container">
          <a-input-search
            v-model="searchQuery"
            placeholder="Search"
            style="width: 200px"
            @search="onSearch"
          />
          <div
            v-show="searchResults.length > 0"
            class="search-results-container"
          >
            <div v-for="result in searchResults[0]" :key="result">
              <NuxtLink :to="'/donghuas/' + result">
                <a-button type="link" @click="clearSearch">{{
                  titlesMap[result][0]
                }}</a-button>
              </NuxtLink>
            </div>
            <div v-for="result in searchResults[1]" :key="result">
              <NuxtLink :to="'/donghuas/' + result">
                <a-button type="link" @click="clearSearch">{{
                  titlesMap[result][1]
                }}</a-button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :md="4" :lg="3" :xxl="2">
        <div class="links-container">
          <a-button type="link"
            ><a href="https://discord.gg/ygUXFTQ">Discord</a></a-button
          >
          <a
            class="github-link"
            href="https://github.com/donghua-network/donghua-hub-frontend"
            ><a-icon
              type="github"
              :style="{
                fontSize: '20px',
              }"
          /></a>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Index } from 'flexsearch'
export default {
  props: {
    titlesMap: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      searchQuery: '',
    }
  },

  computed: {
    searchIndices() {
      const searchIndexEn = new Index()
      const searchIndexRom = new Index({ tokenize: 'forward' })
      for (const entry of Object.entries(this.titlesMap)) {
        if (entry[1][0] !== '') {
          searchIndexEn.add(parseInt(entry[0]), entry[1][0])
        }

        if (entry[1][1] !== '') {
          searchIndexRom.add(parseInt(entry[0]), entry[1][1])
        }
      }
      return {
        en: searchIndexEn,
        rom: searchIndexRom,
      }
    },
    searchResults() {
      if (this.searchQuery !== null && this.searchQuery !== '') {
        const enResults = this.searchIndices.en.search(this.searchQuery, 10)
        const romResults = this.searchIndices.rom
          .search(this.searchQuery, 10)
          .filter((id) => !enResults.includes(id))
        return [enResults, romResults]
      }
      return [[], []]
    },
  },

  methods: {
    clearSearch() {
      this.searchQuery = ''
    },

    onSearch(value) {
      this.searchQuery = ''
      this.$router.push({ path: '/browse', query: { q: value } })
    },
  },
}
</script>
<style scoped>
.links-container {
  display: flex;
  align-items: center;
  justify-content: right;
}
.github-link {
  margin-left: 10px;
  color: black;
}
.github-link:hover {
  color: #40a9ff;
}
.search-container {
  display: inline;
}
.search-results-container {
  position: absolute;
  left: 81px;
  background-color: white;
  border: 1px solid lightgray;
  z-index: 1000;
}
#menu-bar {
  background-color: white;
  padding: 20px 40px 20px 40px;
  box-shadow: 0 2px 8px #f0f1f2;
}
</style>
