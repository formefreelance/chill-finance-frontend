import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Chill } from '../../chill'

export interface ChillContext {
  chill?: typeof Chill
}

export const Context = createContext<ChillContext>({
  chill: undefined,
})

declare global {
  interface Window {
    chillsauce: any
  }
}

const ChillProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [chill, setChill] = useState<any>()
  // @ts-ignore
  window.chill = chill
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const chillLib = new Chill(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setChill(chillLib)
      window.chillsauce = chillLib
    }
  }, [ethereum])

  return <Context.Provider value={{ chill }}>{children}</Context.Provider>
}

export default ChillProvider
