<template>
  <NuxtLink :to="'/donghuas/' + donghua.id">
    <a-card hoverable class="donghua-card">
      <img slot="cover" :src="donghua.image" />
      <a-card-meta :title="donghua.title"></a-card-meta>
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
