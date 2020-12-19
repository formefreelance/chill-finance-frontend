import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { removeLiquidity, getUniswapRouterContract } from '../chill/utils'
import { BigNumber } from '../chill'

const useRemoveLiquidity = (tokenAddress: string) => {
  const { account, ethereum } = useWallet()
  const chill = useChill()

  const handleRemoveLiquidity = useCallback(
    async (amount: string) => {
      const txHash = await removeLiquidity(
        getUniswapRouterContract(chill),
        tokenAddress,
        amount,
        account,
        ethereum as provider
      )
      console.log(txHash)
    },
    [account, chill],
  )
  return { onRemoveLiquidity: handleRemoveLiquidity }
}

export default useRemoveLiquidity
