import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import AirDrop from '../constants/abi/AirDrop.json'

export const getAirDropContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (AirDrop as unknown) as AbiItem,
    address,
  )
  return contract
}
