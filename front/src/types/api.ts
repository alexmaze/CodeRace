export interface IApiError {
  code: string
  message: string
}

export interface IResponse<T> extends IApiError {
  data: T
}

export interface IPageResponse<T> extends IResponse<T[]> {
  page: number
  size: number
  total: number
}

export interface IPageRequest {
  page: number
  size: number
}
