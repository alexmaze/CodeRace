export interface IApiError {
  code: string
  message: string
}

export interface IResponse<T> extends IApiError {
  data: T
}
