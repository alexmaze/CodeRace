import axios from "axios"
import { IApiError } from "@/types"

axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    let errData: IApiError = err.response.data
    if (errData == null) {
      errData = {
        code: "UNKNOWN",
        message: "未知错误",
      }
    }

    return Promise.reject(errData)
  }
)

export * from "./session"
export * from "./question"
