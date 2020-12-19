import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { addLiquidity, getInstaStakeContract } from '../chill/utils'

const useAddLiquidity = (pid: number, tokenAddress: string) => {
  const { account, ethereum } = useWallet()
  const chill = useChill()

  const handleAddLiquidity = useCallback(
    async (amount: string) => {
      const txHash = await addLiquidity(
        getInstaStakeContract(chill),
        tokenAddress,
        amount,
        account,
        ethereum as provider
      )
      console.log(txHash)
    },
    [account, pid, chill],
  )
  return { onAddLiquidity: handleAddLiquidity }
}

export default useAddLiquidity
