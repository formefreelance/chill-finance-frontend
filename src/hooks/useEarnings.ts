import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract } from '../chill/utils'
import useChill from './useChill'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const chill = useChill()
  const masterChefContract = getMasterChefContract(chill)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, masterChefContract, chill])

  useEffect(() => {
    if (account && masterChefContract && chill) {
      fetchBalance()
    }
  }, [account, block, masterChefContract, setBalance, chill])

  return balance
}

export default useEarnings
