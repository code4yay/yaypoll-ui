import { ErrorCode } from './ErrorCode'

/**
 * レスポンスのエラー
 */
export type ResError = {
  code: ErrorCode
  message: string
}

/**
 * レスポンス型
 */
export type Res<T> = {
  response: T
  errors: ResError[]
}
