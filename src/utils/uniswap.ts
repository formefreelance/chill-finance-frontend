import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import UniswapV2Library from '../constants/abi/UniswapV2Library.json'
import UniswapV2Pair from '../constants/abi/UniswapV2Pair.json'

export const getUniswapV2Pair = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (UniswapV2Pair as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getUniswapV2Library = (provider: provider, address: string) => {
    const web3 = new Web3(provider)
    const contract = new web3.eth.Contract(
      (UniswapV2Library as unknown) as AbiItem,
      address,
    )
    return contract
  }