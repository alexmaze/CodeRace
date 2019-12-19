import { ISession } from "@/types"
import { SessionAPI } from "@/apis"
import { Store } from "@/stores/core/store"
import { Log } from "@/utils"
import { observable, computed } from "mobx"
import { autobind } from "core-decorators"

export interface ISessionStoreState {
  loading: boolean
  session: ISession
}

@autobind
export class SessionStore extends Store<ISessionStoreState> {
  @observable loading: boolean
  @observable session: ISession

  constructor() {
    super({
      loading: false,
      session: null,
    })
    this.load()
  }

  @computed
  get isLoggedIn() {
    return this.session != null
  }

  @computed
  get username() {
    if (this.isLoggedIn) {
      return this.session.name
    }

    return ""
  }

  public async load() {
    this.loading = true

    try {
      const res = await SessionAPI.state()
      this.session = res.data
      Log("session").debug("登陆成功", res)
    } catch (err) {
      Log("session").debug("登陆失败", err)
    }

    this.loading = false
  }

  public async login(name: string, password: string) {
    this.loading = true

    try {
      const res = await SessionAPI.login(name, password)
      this.session = res.data
    } catch (err) {
      Log("session").debug("登录失败", err)
    }

    this.loading = false
  }

  public async logout() {
    try {
      await SessionAPI.logout()
    } catch (err) {
      Log("session").debug("登出失败", err)
    }

    this.session = null
  }
}
