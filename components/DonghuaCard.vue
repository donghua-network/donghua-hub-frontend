<template>
  <NuxtLink :to="'/donghuas/' + donghua.id">
    <a-card hoverable class="donghua-card">
      <img slot="cover" :src="donghua.image.url" />
      <a-card-meta :title="donghua.titles.romanized"></a-card-meta>
    </a-card>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    donghua: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style>
.donghua-card {
  width: 200px;
  border: 0;
}

.donghua-card img {
  width: 200px;
  height: 280px;
}
</style>
