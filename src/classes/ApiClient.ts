import axios, { AxiosInstance } from 'axios'
import { Res } from '../types/Res'

export class ApiClient {
  private readonly axios: AxiosInstance

  /**
   * ApiClientのコンストラクタ
   *
   * @param baseURL APIサーバーのURL
   */
  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL })
  }

  /**
   * `email` にトークンを送るAPIを叩きます
   *
   * @param email メールアドレス
   */
  async requestLogInToken(email: string): Promise<void> {
    await this.axios.get('/requestLogInToken', {
      data: {
        email,
      },
    })
  }
}
