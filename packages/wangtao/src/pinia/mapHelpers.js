// mapState(useStore, ['count', 'user'])
// {
//   count() { return useStore().count },
//   user() { return useStore().user }
// }

// mapActions(useStore, ['increment', 'fetchUser'])
// {
//   increment(...args) { return useStore().increment(...args) },
//   fetchUser(...args) { return useStore().fetchUser(...args) }
// }

//取出store中的state做映射
export function mapState(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        // 数组的写法
        reduced[key] = function () {
          return useStore()[key]
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced, key) => {
        // 对象的写法
        reduced[key] = function () {
          const store = useStore()
          const storeKey = keysOrMapper[key] // 获取store中的值

          // 对象中函数的写法
          return typeof storeKey === 'function'
            ? storeKey.call(this, store)
            : store[storeKey]
        }
        return reduced
      }, {})
}

export const mapGetters = mapState

//取出store中的action做映射
export function mapActions(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (...args) {
          return useStore()[key](...args)
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced, key) => {
        // @ts-expect-error
        reduced[key] = function (...args) {
          return useStore()[keysOrMapper[key]](...args)
        }
        return reduced
      }, {})
}
