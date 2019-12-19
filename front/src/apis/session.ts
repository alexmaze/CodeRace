import axios from "axios"
import { IResponse, ISession } from "@/types"

export const SessionAPI = {
  // 获取用户当前 Session 信息
  state(): Promise<IResponse<ISession>> {
    return axios.get("/api/user/state")
  },

  // 创建临时用户，并登陆
  login(name: string, password: string): Promise<IResponse<ISession>> {
    return axios.post("/api/user/login", { name, password })
  },

  // 用户退出
  logout(): Promise<IResponse<void>> {
    return axios.delete("/api/user/logout")
  },
}
