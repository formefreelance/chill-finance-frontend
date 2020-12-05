import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { claimNirvanaIncentive, getDaiEthAirDropContract } from '../chill/utils'
import { airDropAddresses } from '../chill/lib/constants'
import { getAirDropContract } from '../utils/airdrop'

const useAirdrop = (pid: number) => {
  const { account } = useWallet()
  const chill = useChill()
  const { ethereum } = useWallet()

  let airdropContract;
  const networkId = 1;

  const handleAirDrop = useCallback(async () => {
    if (pid == 0) {
      airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.daiEth[networkId]);
    }
    if (airdropContract) { 
        const txHash = await claimNirvanaIncentive(airdropContract, pid, account)
        console.log(txHash)
        return txHash
    }
  }, [account, pid, chill])

  return { onAirdrop: handleAirDrop }
}
export default useAirdrop
