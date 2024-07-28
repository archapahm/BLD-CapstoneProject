import { useAuthContext } from './useAuthContext'

// Firebase imports
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    signOut(auth)
        .then(() => {
            dispatch({ type: 'LOGOUT' })
        })
        .catch((err) => {
            setError(err.message)
        })
  }

  return { logout }
}