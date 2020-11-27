import { useCallback } from 'react'

import useChill from './useChill'
import { useWallet } from 'use-wallet'

import { claimNirvanaIncentive, getDaiEthAirDropContract } from '../chill/utils'
import { airDropAddresses } from '../chill/lib/constants'

const useAirdrop = (pid: number) => {
  const { account } = useWallet()
  const chill = useChill()
  
  let airdropContract;
  if (pid == 0) {
    airdropContract = getDaiEthAirDropContract(chill);
  }

  const handleAirDrop = useCallback(async () => {
    const txHash = await claimNirvanaIncentive(airdropContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, chill])

  return { onAirdrop: handleAirDrop }
}
export default useAirdrop
