import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
debugger
//第一个参数，id;第二个参数setup函数
export const useStore2 = defineStore('counter', () => {
  //ref
  const count = ref(0)
  const firstName = ref('kobe')
  const lastName = ref('byrant')
  //getter
  const doubleCount = computed(() => count.value * 2)
  const fullName = computed(() => firstName.value + ' ' + lastName.value)

  //action
  const increment = () => {
    count.value++
  }

  const setFirstName = (newValue) => {
    firstName.value = newValue
  }

  return {
    count,
    doubleCount,
    firstName,
    lastName,
    fullName,
    increment,
    setFirstName,
  }
})
