import { createContext } from 'react'
import { ApiClient } from '../classes/ApiClient'

/**
 * ApiContextData type.
 */
export type ApiContextData = {
  client: ApiClient
}

export const ApiContext = createContext<ApiContextData>({
  client: new ApiClient('localhost'),
})

/**
 * ApiProviderProps type.
 */
export type ApiProviderProps = {
  /**
   * APIのベースURL
   */
  baseURL: string
}

/**
 * ApiProvider component.
 */
export const ApiProvider: React.FC<ApiProviderProps> = (props) => {
  const { baseURL } = props
  const client = new ApiClient(baseURL)

  return (
    <ApiContext.Provider value={{ client }}>
      {props.children}
    </ApiContext.Provider>
  )
}
