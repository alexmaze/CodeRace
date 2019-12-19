export interface IDisposer {
  (): void
}

const DISPOSERS = Symbol("disposers")

export class Disposable {
  [DISPOSERS]: IDisposer[]

  constructor() {
    this[DISPOSERS] = []
  }

  addDisposer(...disposers: IDisposer[]) {
    this[DISPOSERS] = this[DISPOSERS].concat(disposers)
  }

  dispose() {
    this[DISPOSERS].forEach((disposer: IDisposer) => {
      try {
        disposer()
      } catch (e) {
        /* do nothing */
        console.error(e)
      }
    })
  }
}
