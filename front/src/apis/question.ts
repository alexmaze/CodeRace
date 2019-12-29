import axios from "axios"
import { IQuestion, IResponse, IPageRequest, IPageResponse } from "@/types"
import { IFile } from "@/components/IDE"

export const QuestionAPI = {
  // 题目列表
  list(params: IPageRequest): Promise<IPageResponse<IQuestion>> {
    return axios.get(`/api/question`, { params }).then(res => res.data)
  },

  // 题目详情
  show(id: string): Promise<IResponse<IQuestion>> {
    return axios.get(`/api/question/${id}`).then(res => res.data)
  },

  // 题目目录数据
  showFolder(id: string): Promise<IResponse<IFile>> {
    return axios.get(`/api/question/${id}/folder`).then(res => res.data)
  },

  // 题目目录中文件内容
  showFileContent(id: string, path: string): Promise<IResponse<string>> {
    return axios
      .get(`/api/question/${id}/file`, {
        params: { path },
      })
      .then(res => res.data)
  },

  // 提交执行，并返回结果
  submit(id: string, files: { [path: string]: string }): Promise<IResponse<IQuestionExecLogs>> {
    return axios.post(`/api/question/${id}/submit`, files).then(res => res.data)
  },
}

export interface IQuestionExecLogs {
  build: string
  run: string
  time: string
}
