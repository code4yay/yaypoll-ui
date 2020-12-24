import axios, { AxiosInstance } from 'axios'
import { Res } from '../types/Res'
import { Work } from '../types/Work'

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
    const res = await this.axios.get<Res>(
      '/users/requestLogInToken?email=' + email
    )

    return res.data
  }

  /**
   * `email` と `token` をログインAPIに送信し、成功すれば次回以降のリクエストにjwtを付与します。
   *
   * @param email メールアドレス
   * @param token トークン
   */
  async login(email: string, token: string): Promise<Res<{ jwt: string }>> {
    const res = await this.axios.post<Res<{ jwt: string }>>('/users/login', {
      email,
      token,
    })

    if (res.data.errors.length === 0) {
      this.token = res.data.response.jwt
      console.log(this)
    }

    return res.data
  }

  /**
   * 作品一覧を取得します。
   */
  async getWorks(): Promise<Res<{ works: Work[] }>> {
    const res = await this.axios.get<Res<{ works: Work[] }>>('/works', {
      headers: {
        Authorization: this.token,
      },
    })

    return res.data
  }

  /**
   * 作品に票を入れます。
   *
   * @param id 作品のid
   */
  async voteWork(id: string): Promise<Res> {
    const res = await this.axios.post<Res>(
      `/works/${id}/vote`,
      {},
      {
        headers: { Authorization: this.token },
      }
    )

    return res.data
  }
}
