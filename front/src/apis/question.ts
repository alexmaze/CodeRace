import axios from "axios"
import { IQuestion, IResponse } from "@/types"

export const QuestionAPI = {
  // 题目详情
  show(id: string): Promise<IResponse<IQuestion>> {
    return axios.get(`/api/question/${id}`)
  },
}
