<template>
  <div>
      <Home :size="size"></Home>
      <Paid :size="size"></Paid>
  </div>
</template>

<script setup lang="ts">
import { Home, Paid } from '@icon-space/vue-next'

const size = 22
</script>

<style>
</style>
