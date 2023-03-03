<template>
  <div>
      <Home :size="size"></Home>
      <Paid :size="size"></Paid>
      <Openai :size="size"></Openai>
      <Dingtalk :size="size"></Dingtalk>
  </div>
</template>

<script setup lang="ts">
import { Home, Paid, Openai, Dingtalk } from '@icon-space/vue-next'

const size = 50
</script>

<style>
</style>
