import { createApp } from 'vue'
import './style.css'
import { createPinia } from './pinia'
import App from './App.vue'

//vuex 缺点 ts的兼容性不好 命名空间缺陷（只有一个store） mutation和action区别
//pinia 优点：ts兼容行好  不需要命名空间（可以创建多个store） mutation删掉了
const app = createApp(App)
const pinia = createPinia()

pinia.use(function ({ store }) {
  store.$subscribe((state) => {
    console.log(state)
  })
})
app.use(pinia)
app.mount('#app')
