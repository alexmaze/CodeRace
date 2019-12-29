export enum QuestionStatus {
  Racing = "Racing",
  Planing = "Planing",
  Finished = "Finished",
}

export enum CodeLanguage {
  Golang = "go",
}

export interface IQuestion {
  id: number
  title: string
  description: string
  language: CodeLanguage
  status: QuestionStatus
  due_date: string
  created_at: string
  updated_at: string
}
