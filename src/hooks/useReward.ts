import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'

import { harvest, getMasterChefContract } from '../chill/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const chill = useChill()
  const masterChefContract = getMasterChefContract(chill)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, chill])

  return { onReward: handleReward }
}

export default useReward
