<template>
  <div id="menu-bar">
    <a-row>
      <a-col :md="6" :lg="5" :xxl="4">
        <NuxtLink to="/"><img src="~/assets/banner_logo.png" /></NuxtLink>
      </a-col>
      <a-col :md="18" :lg="19" :xxl="20">
        <NuxtLink to="/browse"
          ><a-button type="link">Browse</a-button></NuxtLink
        >
        <a-input-search
          placeholder="Search"
          style="width: 200px"
          @search="onSearch"
        />
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
#menu-bar {
  background-color: white;
  padding: 20px 20px 20px 40px;
  box-shadow: 0 2px 8px #f0f1f2;
  margin-bottom: 50px;
}
</style>
