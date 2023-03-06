<template>
  <div>
      <Home :size="size"></Home>
      <Zhihu :size="size"></Zhihu>
      <Bilibili :size="size"></Bilibili>
      <Juejin :size="size"></Juejin>
      <Discord :size="size"></Discord>
      <ExpandAll :size="size"></ExpandAll>
      <CollapseAll :size="size"></CollapseAll>
  </div>
</template>

<script setup lang="ts">
import { Home, Zhihu, Bilibili, Juejin, Discord, ExpandAll, CollapseAll } from '@icon-space/vue-next'

const size = 50
</script>

<style>
</style>
