import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'

import { unstake, getMasterChefContract } from '../chill/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const chill = useChill()
  const masterChefContract = getMasterChefContract(chill)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, chill],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
