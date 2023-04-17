<template>
  <div>
      <IconACane :size="50" @mouseup="click"></IconACane>
  </div>
</template>

<script setup lang="ts">
const click = () => {
    console.log(123)
}

</script>

<style>
.i-icon {
    cursor: pointer;
}
</style>
