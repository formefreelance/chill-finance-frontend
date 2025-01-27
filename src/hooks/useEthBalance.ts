import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getEthBalance } from '../utils/erc20'
import useBlock from './useBlock'

const useEthBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEthBalance(ethereum, account)
    setBalance(new BigNumber(balance))
  }, [account, ethereum])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block])
  return balance
}

export default useEthBalance
