import { Pinia, PiniaPlugin, setActivePinia, piniaSymbol } from './rootStore'
import { ref, App, markRaw, effectScope, Ref } from 'vue'
import { registerPiniaDevtools, devtoolsPlugin } from './devtools'
import { IS_CLIENT } from './env'
import { StateTree, StoreGeneric } from './types'

/**
 * Creates a Pinia instance to be used by the application
 */
//创建一个pinia的实例
export function createPinia(): Pinia {
  //创减一个effectScope,用来管理pinia的副作用
  //对所有的状态做管理 统一来管理，当有一天pinia失效，全部失效
  const scope = effectScope(true)
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  //创建一个ref({}),state = ref({})

  //state用来存储store的状态，放到scope的目的是为了方便之后清理的时候，只需要停止这个作用域就可以了
  //本质是定义一个ref,所有store的state都会哦保存到state中

  //store1 -> id:state1
  //store2 -> id:state2

  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({})
  )!

  //用于存放插件
  let _p: Pinia['_p'] = []
  // plugins added before calling app.use(pinia)
  let toBeInstalled: PiniaPlugin[] = []

  //markRaw标记一下不应该被Vue进行响应式转化（pinia实例本身不需要响应式，它是通过内部的state来管理响应式）
  const pinia: Pinia = markRaw({
    //app.use(pinia)安装插件时，会调用该方法
    install(app: App) {
      // this allows calling useStore() outside of a component setup after
      // installing pinia's plugin
      //将当前创建的pinia设置给activePinia
      setActivePinia(pinia)
      //保存一个app
      pinia._a = app
      //通过provide注入: key作为piniaSybol 值为pinia
      app.provide(piniaSymbol, pinia)
      //在app中保持一个全局的$pinia = pinia
      app.config.globalProperties.$pinia = pinia
      /* istanbul ignore else */
      if (__USE_DEVTOOLS__ && IS_CLIENT) {
        registerPiniaDevtools(app, pinia)
      }
      //将所有等待安装的插件太耐到_p的数组中，并且清空toBeInstalled
      toBeInstalled.forEach((plugin) => _p.push(plugin))
      toBeInstalled = []
    },

    //pinia安装插件
    use(plugin) {
      if (!this._a) {
        //判断this._a有没有值
        toBeInstalled.push(plugin) //有值，说明先执行的install,那么先放到toBeInstalled
      } else {
        //没有值，先执行的use,那么直接放到_p
        _p.push(plugin)
      }
      //返回pinia对象，所以可以链式调用.use(x).use(y).use(z)
      return this
    },
    //存放所有的插件
    _p,
    // it's actually undefined here
    // @ts-expect-error
    //app对象
    _a: null,
    //当前的scope（一起管理的）
    _e: scope,
    //store的Map
    //用来存放store实例的
    _s: new Map<string, StoreGeneric>(),
    //state,也就是ref对象
    state,
  })

  // pinia devtools rely on dev only features so they cannot be forced unless
  // the dev build of Vue is used. Avoid old browsers like IE11.
  if (__USE_DEVTOOLS__ && IS_CLIENT && typeof Proxy !== 'undefined') {
    pinia.use(devtoolsPlugin)
  }

  return pinia
}

/**
 * Dispose a Pinia instance by stopping its effectScope and removing the state, plugins and stores. This is mostly
 * useful in tests, with both a testing pinia or a regular pinia and in applications that use multiple pinia instances.
 * Once disposed, the pinia instance cannot be used anymore.
 *
 * @param pinia - pinia instance
 */
export function disposePinia(pinia: Pinia) {
  pinia._e.stop()
  pinia._s.clear()
  pinia._p.splice(0)
  pinia.state.value = {}
  // @ts-expect-error: non valid
  pinia._a = null
}
