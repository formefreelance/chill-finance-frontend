import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

export interface Farm {
  pid: number
  name: string
  lpToken: string
  lpTokenAddress: string
  lpContract: Contract
  tokenAddress: string
  earnToken: string
  earnTokenAddress: string
  icon: React.ReactNode
  id: string
  tokenSymbol: string
  poolWeight: BigNumber
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
}
