import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useChill from './useChill'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getMasterChefContract, getUniswapRouterContract } from '../chill/utils'

const useAllowance = (lpContract: Contract, flag: Number) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const chill = useChill()
  const masterChefContract = getMasterChefContract(chill)
  const uniswapRouterContract = getUniswapRouterContract(chill)
  let allowances
  
  const fetchAllowance = useCallback(async () => {
    if (flag == 0) {
      allowances = await getAllowance(
        lpContract,
        masterChefContract,
        account,
      )
    } else {
      allowances = await getAllowance(
        lpContract,
        uniswapRouterContract,
        account,
      )
    }
    setAllowance(new BigNumber(allowances))
  }, [account, masterChefContract, lpContract])

  useEffect(() => {
    if (account && masterChefContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, masterChefContract, lpContract])

  return allowance
}

export default useAllowance
