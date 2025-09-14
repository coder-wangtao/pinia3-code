<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { useStore2 } from './store/counter.js'
debugger
const store = useStore2()
const { increment } = store

// setTimeout(() => {
//   store.$dispose()
// }, 1000)

const handleClick = () => {
  store.$state = { count: 100 }
}

// store.$subscribe((mutation, state) => {
//   //回调
//   console.log('数据变化', state, mutation)
// })

store.$onAction(({ after, onError, name }) => {
  //发布订阅
  console.log('action执行了', name)

  after((result) => {
    console.log('状态已经更新完毕了')
  })

  after((result) => {
    console.log('状态已经更新完毕了')
  })

  onError(() => {
    console.log('出错')
  })
})
</script>

<template>
  <h1>store测试案例</h1>
  <h2>当前计数：{{ store.count }}</h2>
  <h2>双倍计数：{{ store.doubleCount }}</h2>
  <button @click="store.count++">+1</button>
  <button @click="handleClick">+1</button>
  <h2>{{ store.fullName }}</h2>
  <!-- <button @click="() => store.setFirstName('why')">修改firstName</button> -->
</template>

<style scoped></style>
