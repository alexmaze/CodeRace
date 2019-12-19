import {
  autorun,
  isComputedProp,
  isObservableProp,
  isObservableArray,
  isObservableMap,
  IObservableArray,
  ObservableMap,
} from "mobx"

// TODO: 优化实现
// 从持久化存储中恢复 store 数据，并在后续将 store 内容变更同步到持久化存储
export function preserveState(store: any, key: string, storage: Storage): void {
  const storageKey = `QN_FE.CORE.STORE.PRESERVE_STATE.${key}`

  // resume data from storage
  const saved = storage.getItem(storageKey)
  if (saved) {
    try {
      store.resume(JSON.parse(saved))
    } catch (e) {
      /* do nothing */
      console.error(e)
    }
  }

  // sync change to storage
  store.addDisposer(
    autorun(() => {
      storage.setItem(storageKey, JSON.stringify(store.snapshot))
    })
  )
}

// 若 store 上实现了字段名为本值的方法，会被 getSnapshot 使用
export const GET_SNAPSHOT = Symbol("getSnapshot")

export function getSnapshot(target: any): any {
  // 若有自定义的 getSnapshot 方法，调用之
  if (target && typeof target[GET_SNAPSHOT] === "function") {
    target = getSnapshot(target[GET_SNAPSHOT]())
  }

  // 基础数据结构直接返回原值
  if (isBasicValue(target)) {
    return target
  }

  // 语言内置的复杂类型不做 snapshot
  if (isBuiltInType(target)) {
    return undefined
  }

  // observableArray / Array
  if (isObservableArray(target) || Array.isArray(target)) {
    return target.map(item => getSnapshot(item))
  }

  // observableMap
  if (isObservableMap(target)) {
    const snapshot: any = {}
    for (let [k, v] of target.entries()) {
      snapshot[k] = getSnapshot(v)
    }
    return snapshot
  }

  // object
  const snapshot: any = {}

  for (let key in target) {
    // 原型链上的数据不做快照
    if (!target.hasOwnProperty(key)) {
      continue
    }

    // 对计算属性不做快照
    // FIX: 这里不先判断下 isObservableProp 的话，直接执行 isComputedProp 会报错（mobx@2.7.0）
    if (isObservableProp(target, key) && isComputedProp(target, key)) {
      continue
    }

    const value = getSnapshot(target[key])

    if (typeof value === "undefined") {
      continue
    }

    snapshot[key] = value
  }

  return snapshot
}

// 若 store 上实现了字段名为本值的方法，会被 resume 使用
export const RESUME = Symbol("resume")

export function resume(target: any, snapshot: any): void {
  // 若有自定义的 resume 方法，调用之
  if (target && typeof target[RESUME] === "function") {
    target[RESUME](snapshot)
    return
  }

  if (!snapshot) {
    return
  }

  for (let key in snapshot) {
    // 对快照原型链上的属性不做恢复
    if (!snapshot.hasOwnProperty(key)) {
      continue
    }

    // 对计算属性不做恢复
    // FIX: 这里不先判断下 isObservableProp 的话，直接执行 isComputedProp 会报错（mobx@2.7.0）
    if (isObservableProp(target, key) && isComputedProp(target, key)) {
      continue
    }

    // 若该项是 observable array，调用其 replace 方法
    if (isObservableArray(target[key])) {
      ;(target[key] as IObservableArray<any>).replace(snapshot[key])
      continue
    }

    // 若该项是 observable map，先 clear，再 merge
    if (isObservableMap(target[key])) {
      const current: ObservableMap<any> = target[key]
      current.clear()
      current.merge(snapshot[key])
      continue
    }

    // 若该项是 object，extend 之
    if (isPlainObject(target[key]) && isPlainObject(snapshot[key])) {
      resume(target[key], snapshot[key])
      continue
    }

    // 否则，直接替换
    target[key] = snapshot[key]
  }
}

function isBasicValue(target: any) {
  return target == null || typeof target === "number" || typeof target === "string" || typeof target === "boolean"
}

function isBuiltInType(target: any) {
  return target instanceof RegExp || target instanceof Date || typeof target === "function"
}

function isPlainObject(target: any) {
  return typeof target === "object" && !isBasicValue(target) && !isBuiltInType(target)
}
