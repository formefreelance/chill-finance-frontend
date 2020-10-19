import { useContext } from 'react'
import { Context } from '../contexts/ChillProvider'

const useChill = () => {
  const { chill } = useContext(Context)
  return chill
}

export default useChill
