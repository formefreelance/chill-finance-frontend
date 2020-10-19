import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'

import { stake, getMasterChefContract } from '../chill/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const chill = useChill()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getMasterChefContract(chill),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, chill],
  )

  return { onStake: handleStake }
}

export default useStake
