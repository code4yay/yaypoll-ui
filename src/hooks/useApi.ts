import { useContext } from 'react'
import { ApiClient } from '../classes/ApiClient'
import { ApiContext } from '../contexts/ApiContext'

/**
 * 直近のApiContextからApiClientを取得して返します
 */
export const useApi = (): ApiClient => {
  const api = useContext(ApiContext)

  return api.client
}
