import { extend } from "lodash"
import { action, computed } from "mobx"
import { Disposable } from "./disposable"
import { getSnapshot, resume } from "./helper"

export abstract class Store<IState = any> extends Disposable {
  constructor(initialState?: IState) {
    super()

    if (initialState) {
      extend(this, initialState)
    }
  }

  // 不建议使用，建议直接使用 `getSnapshot(store)`，这里保留以保持向前兼容
  @computed get snapshot(): any {
    return getSnapshot(this)
  }

  // 不建议使用，建议直接使用 `resume(store, snapshot)`，这里保留以保持向前兼容
  @action resume(snapshot: any): void {
    return resume(this, snapshot)
  }
}
