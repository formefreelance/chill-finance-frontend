import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getUniswapRouterContract } from '../chill/utils'

const useRemoveApprove = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const chill = useChill()
  const uniswapRouterContract = getUniswapRouterContract(chill)

  const handleRemoveApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, uniswapRouterContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract])

  return { onRemoveApprove: handleRemoveApprove }
}

export default useRemoveApprove
