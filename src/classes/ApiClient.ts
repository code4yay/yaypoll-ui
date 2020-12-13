import axios, { AxiosInstance } from 'axios'
import { Res } from '../types/Res'

export class ApiClient {
  private readonly axios: AxiosInstance

  private token = ''

  /**
   * ApiClientのコンストラクタ
   *
   * @param baseURL APIサーバーのURL
   */
  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL })
  }

  /**
   * 現在ログインしているかどうかを返します
   */
  isLoggedIn(): boolean {
    return this.token !== ''
  }

  /**
   * `email` にトークンを送るAPIを叩きます
   *
   * @param email メールアドレス
   */
  async requestLogInToken(email: string): Promise<Res> {
    const res = await this.axios.get<Res>('/requestLogInToken?email=' + email)

    return res.data
  }

  async login(email: string, token: string): Promise<Res<{ jwt: string }>> {
    const res = await this.axios.post<Res<{ jwt: string }>>('/login', {
      email,
      token,
    })

    if (res.data.errors.length === 0) {
      this.token = res.data.response.jwt
      console.log(this)
    }

    return res.data
  }
}
