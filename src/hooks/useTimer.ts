import { useEffect, useState } from 'react'

import useChill from './useChill'

import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getDaiEthAirDropRewardAmount, getDaiEthAirDropContract, getChillBalanceOf, getDaiEthAirDropTimeStamp } from '../chill/utils'
import { airDropAddresses } from '../chill/lib/constants'
import { getAirDropContract } from '../utils/airdrop'
import BigNumber from 'bignumber.js'

const useTimer = (pid: number) => {
  const chill = useChill()
  const { ethereum } = useWallet()

  const [rewardAmount, setReward] = useState(new BigNumber(0))
  const [totalBalanceReward, setTotalBalanceReward] = useState(new BigNumber(0))
  const [timeStamp, setTimeStamp] = useState(Number)
  const [days, setDays] = useState(Number)
  const [hours, setHours] = useState(Number)
  const [minutes, setMinutes] = useState(Number)
  const [seconds, setSeconds] = useState(Number)

  useEffect(() => {
    
    async function getReward() {
      let airdropContract;
      
      if (pid == 0) {
        console.log("AirDrop:")
        const networkId = 1;
        // airdropContract = getDaiEthAirDropContract(chill);
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.chillEth[networkId]);
        const totalBalanceRewards = await getChillBalanceOf(chill, airDropAddresses.chillEth[networkId]);
        setTotalBalanceReward(new BigNumber(totalBalanceRewards))
      } 
      console.log("AirDrop2:")

      // else if (pid == 1) {
      //   const networkId = 1;
      //   airdropContract = getDaiEthAirDropContract(chill);
      //   const totalBalanceRewards = await getChillBalanceOf(chill, airDropAddresses.daiEth[networkId]);
      //   setTotalBalanceReward(new BigNumber(totalBalanceRewards))
      // } else if (pid == 2) {
      //   const networkId = 1;
      //   airdropContract = getDaiEthAirDropContract(chill);
      //   const totalBalanceRewards = await getChillBalanceOf(chill, airDropAddresses.daiEth[networkId]);
      //   setTotalBalanceReward(new BigNumber(totalBalanceRewards))
      // } 
      if(airdropContract) {
        getDaiEthAirDropRewardAmount(airdropContract).then((reward) => {
          setReward(new BigNumber(reward));
        });
        getDaiEthAirDropTimeStamp(airdropContract).then((timeStamp) => {
          setTimeStamp(timeStamp);
        });
      }
    }
    if (chill) {
      getReward()
    }
  }, [chill]);

  useEffect(() => {
    async function timer() {
      const x = setInterval(() => {
        if(timeStamp > 0) {
        const now = new Date().getTime();
        const distance = (timeStamp*1000) - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setDays(days)
        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
          if (distance < 0) {
            setDays(0)
            setHours(0)
            setMinutes(0)
            setSeconds(0)
          }
        }
      }, 1000);
    }
    if (chill) {
      timer()
    }
  }, [chill, timeStamp]);

  return {totalBalanceReward, rewardAmount, days, hours, minutes, seconds}
}
export default useTimer
