<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { useStore2 } from './store/counter.js'
const store = useStore2()
</script>

<template>
  <h1>store测试案例</h1>
  <h2>当前计数：{{ store.count }}</h2>
  <h2>双倍计数：{{ store.doubleCount }}</h2>
  <button @click="store.increment">+1</button>
  <h2>{{ store.fullName }}</h2>
  <button @click="() => store.setFirstName('why')">修改firstName</button>
</template>

<style scoped></style>
