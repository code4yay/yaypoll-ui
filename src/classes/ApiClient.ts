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
  async requestLogInToken(email: string): Promise<boolean> {
    const res = await this.axios.get<Res>('/requestLogInToken?email=' + email)

    return res.data.errors.length === 0
  }

  async login(email: string, token: string): Promise<boolean> {
    const res = await this.axios.post<Res<{ jwt: string }>>('/login', {
      email,
      token,
    })

    if (res.data.errors.length === 0) {
      this.axios.defaults.headers['Authroization'] = res.data.response.jwt
      return true
    }

    return false
  }
}
