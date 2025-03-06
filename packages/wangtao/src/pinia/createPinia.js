// 存的是createPinia这个api
import { ref, effectScope } from 'vue'
import { SymbolPinia } from './rootStore'
export let activePinia // 全局变量
export const setActivePinia = (pinia) => (activePinia = pinia)
export function createPinia() {
  const scope = effectScope()
  const state = scope.run(() => ref({})) // 用来存储每个store的state的
  // scope.stop() 可以通过一个方法全面停止响应式

  // 状态里面 可能会存放 计算属性 computed
  const _p = []
  const pinia = {
    use(plugin) {
      _p.push(plugin)
      return this // 链式写法 可以一直.use().use()
    },
    _p,
    _s: new Map(), // 这跟用这个map来存放所有的store {counter1=> store, counter2=> store}
    _e: scope, //
    install(app) {
      setActivePinia(pinia)
      // 对于pinia而言，我们希望让它取管理所有的store
      // pinia 要去收集所有store的信息，过一会想卸载store
      // 如何让所有的store都能获取这个pinia对象
      app.provide(SymbolPinia, pinia) // 所有组件都可以通过 app.inject(SymbolPinia)

      // this.$pinia
      app.config.globalProperties.$pinia = pinia // 让vue2的组件实例也可以共享
    },
    state,
  }
  return pinia
}

// effectScope

// createPinia(),默认是一个插件具备一个install方法
// _s 用来存储 id =>  store
// state 用来存储所有状态
// _e 用来停止所有状态
