/**
 * @description: 添加订阅
 * @param {*} subscriptions
 * @param {*} callback
 * @return {*}
 */
export function addSubscription(subscriptions, callback) {
  subscriptions.push(callback)

  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, -1)
    }
  }
  return removeSubscription
}

/**
 * @description: 触发/执行 Subscription 依次执行
 * @param {*} subscriptions
 * @param {array} ags
 * @return {*}
 */
export function triggerSubscriptions(subscriptions, ...ags) {
  subscriptions.slice().forEach((cb) => cb(...ags))
}

// 发布和订阅
