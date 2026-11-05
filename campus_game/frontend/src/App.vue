<template>
  <router-view />
  <!-- 算法哥：右上角头像（点它就是对话入口，主动观察也从这个头像出气泡） -->
  <AgentWatch />
</template>

<script setup>
import AgentWatch from '@/views/components/AgentWatch.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}
</style>
