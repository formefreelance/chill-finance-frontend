import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getMasterChefContract } from '../chill/utils'
import useChill from './useChill'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const chill = useChill()
  const masterChefContract = getMasterChefContract(chill)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, chill])

  useEffect(() => {
    if (account && chill) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, chill])

  return balance
}

export default useStakedBalance
