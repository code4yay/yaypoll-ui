import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useApi } from './useApi'

/**
 * ログインしていない場合、空のノードを返し、ログインページに遷移します。
 */
export const useAuth = (): React.ReactElement | void => {
  if (!process.browser) {
    return <></>
  }

  const api = useApi()
  console.log(api)

  if (api.isLoggedIn()) {
    return
  }

  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [])

  return <></>
}
