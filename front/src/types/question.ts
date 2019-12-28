export enum QuestionStatus {
  Racing = "Racing",
  Planing = "Planing",
  Finished = "Finished",
}

export enum CodeLanguage {
  Golang = "golang",
}

export interface IQuestion {
  id: number
  title: string
  description: string
  language: string
  status: QuestionStatus
  due_date: string
  created_at: string
  updated_at: string
}
