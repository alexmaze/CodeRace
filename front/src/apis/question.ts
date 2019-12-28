import axios from "axios"
import { IQuestion, IResponse, IPageRequest, IPageResponse } from "@/types"

export const QuestionAPI = {
  // 题目列表
  list(params: IPageRequest): Promise<IPageResponse<IQuestion>> {
    return axios.get(`/api/question`, { params }).then(res => res.data)
  },

  // 题目详情
  show(id: string): Promise<IResponse<IQuestion>> {
    return axios.get(`/api/question/${id}`).then(res => res.data)
  },
}
