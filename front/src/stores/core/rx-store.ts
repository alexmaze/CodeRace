import { Subject, Subscribable } from "rxjs"
import { Disposable } from "./disposable"

export abstract class RxStore<IState> extends Disposable implements Subscribable<IState> {
  public state: IState
  protected subject: Subject<IState> = new Subject()

  public subscribe = this.subject.subscribe.bind(this.subject)

  constructor(initialState: IState) {
    super()
    this.next(initialState)
  }

  protected next(v: IState) {
    this.state = v
    this.subject.next(v)
  }

  protected nextPartial(v: Partial<IState>) {
    if (this.state == null) {
      this.state = {} as any
    }

    this.state = {
      ...this.state,
      ...v,
    }

    this.next(this.state)
  }
}
