import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../chill/utils'
import useChill from './useChill'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const chill = useChill()
  const farms = getFarms(chill)
  const masterChefContract = getMasterChefContract(chill)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(masterChefContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, masterChefContract, chill])

  useEffect(() => {
    if (account && masterChefContract && chill) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, chill])

  return balances
}

export default useAllEarnings
