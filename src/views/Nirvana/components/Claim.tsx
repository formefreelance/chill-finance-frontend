import React, { useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAirdrop from '../../../hooks/useAirdrop'
import useTimer from '../../../hooks/useTimer'
import useChill from '../../../hooks/useChill'
import { getBalanceNumber } from '../../../utils/formatBalance'
import Spacer from '../../../components/Spacer'
import { getNirvanaStatus, getMasterChefContract, getDaiEthAirDropScheduleAttend, getNirvana, getUserAmount,
    getTotalPoolBalance, getDaiEthAirDropRewardAmount, getDaiEthAirDropTimeStamp, getDaiEthAirDropNextScheduleAttend
      } from '../../../chill/utils'
import { airDropAddresses } from '../../../chill/lib/constants'
import { getAirDropContract } from '../../../utils/airdrop'
import BigNumber from 'bignumber.js'
interface ClaimProps {
  pid: number
  name: string
  iconSrc: string
}

const Claim: React.FC<ClaimProps> = ({ pid, name, iconSrc }) => {
  const chill = useChill()
  const { ethereum } = useWallet()
  const { account } = useWallet()
  const [pendingTx, setPendingTx] = useState(false)
  const [isNirvana, setIsNirvavna] = useState(false)
  const [isScheduleAttend, setIsScheduleAttend] = useState(false)
  const [isAmount, setIsUserHasAmount] = useState(false)
  const [currentReward, setUserCurrentReward] = useState(new BigNumber(0))
  const { onAirdrop } = useAirdrop(pid)
  const { totalBalanceReward, rewardAmount, days, hours, minutes, seconds } = useTimer(pid)
  const networkId = 1;

  useEffect(() => {
    async function process() {
      let airdropContract;
      const nirvanaRank = await getNirvanaStatus(pid, account, getMasterChefContract(chill))
      const userAmount = await getUserAmount(pid, account, getMasterChefContract(chill))
      if(userAmount > 0) {
        setIsUserHasAmount(true)
      }
      if (pid == 0) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.chillEth[networkId]);
      } else if (pid == 1) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.usdtEth[networkId]);
      } else if (pid == 2) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.daiEth[networkId]);
      }
      const scheduleAttend = await getDaiEthAirDropScheduleAttend(airdropContract, account)
      // const isNirva = await getNirvana(airdropContract, pid)
      const nirvanaTimeStamp = await getDaiEthAirDropTimeStamp(airdropContract);
      const currentTimeStamp = new Date().getTime()

      if(scheduleAttend == true) {
        setIsScheduleAttend(true)
        console.log('Schedule: ', pid, scheduleAttend)
      } 

      const t = new BigNumber(currentTimeStamp).div(new BigNumber(1000)).toNumber().toString()
      console.log("TimeStamper: ", t)

      if (new BigNumber(nirvanaTimeStamp).lt(new BigNumber(currentTimeStamp).div(new BigNumber(1000)).toNumber())) {
        console.log("Timess:", pid)
        const nextSchedule = await getDaiEthAirDropNextScheduleAttend(airdropContract, account)
        if(nextSchedule == false) {
          console.log('scheduleCount: ', pid, nextSchedule)
          setIsScheduleAttend(false)
        }
      }
      if(nirvanaRank == 50) {
        console.log("Nirvanas: ", pid, true)
        setIsNirvavna(true)
      }
    }
    if (chill && account) {
      process()
    }
  }, [chill]);
  
  useEffect(() => {
    async function process() {
      let airdropContract;
      const totalPoolBalance = await getTotalPoolBalance(getMasterChefContract(chill), pid)
      const userAmount = await getUserAmount(pid, account, getMasterChefContract(chill))
      if (pid == 0) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.chillEth[networkId]);
      } else if (pid == 1) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.usdtEth[networkId]);
      } else if (pid == 2) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.daiEth[networkId]);
      }
      const rewardAmount = await getDaiEthAirDropRewardAmount(airdropContract)
      let trasferBalancePercent = new BigNumber(userAmount).multipliedBy(new BigNumber(100)).div(new BigNumber(totalPoolBalance))
      // if(trasferBalancePercent.isGreaterThanOrEqualTo(1)) {
      const transferBalance = trasferBalancePercent.integerValue(BigNumber.ROUND_FLOOR).multipliedBy(new BigNumber(rewardAmount)).div(new BigNumber(100)) 
      // }
      
      console.log('userAmount++++', userAmount, pid)
      console.log('totalPoolBalance++++', totalPoolBalance.toString(), pid)
      console.log('trasferBalancePercent++++', trasferBalancePercent.toString(), pid)
      console.log('rewardAmount++++', rewardAmount, pid)
      console.log('transferBalance++++', transferBalance.toString(), pid)
      setUserCurrentReward(transferBalance)
    }
    if (chill && account) {
      process()
    }
  }, [chill]);

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>{<img src={iconSrc} style={{ marginTop: -4, width: "120px", height: "120px" }} />}</CardIcon>
            <StyledTitle>{name}</StyledTitle>
            <Label text="Total Reward Pool" />
            <Value value={getBalanceNumber(totalBalanceReward)} />
            <Spacer/>
            <Label text="You will recieve:" />
            <Value value={!isScheduleAttend ? getBalanceNumber(currentReward) : '0' } />
            {/* <Value value={isScheduleAttend ? currentReward : '0' } /> */}

            <Label text={isScheduleAttend ? "You have claimed for this session" : ''} />
            <Spacer/>
            <Spacer/>
            <Label text="Time Until Session" />
            <Label text={`${days.toString()} Days : ${hours.toString()} Hours : ${minutes.toString()} Minutes : ${seconds.toString()} Seconds`} />
          </StyledCardHeader>
          <StyledCardActions>
            {console.log('isNirvana:++', isNirvana)}
            
            { isNirvana && !isScheduleAttend && isAmount ? 
                  <Button
                  // disabled={rewardAmount.gt(0) ? false : true}
                  disabled={false}
                  text={pendingTx ? 'Collecting Reward' : 'Claim Reward'}
                  onClick={async () => {
                    setPendingTx(true)
                    await onAirdrop()
                    setPendingTx(false)
                  }}
                /> 
                : 
                 <Button
                 disabled={true}
                 text={'You are not in Nirvana or already claimed!'}
                 onClick={async () => {
                   setPendingTx(true)
                   await onAirdrop()
                   setPendingTx(false)
               }}
               />
             }
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 11px;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

export default Claim
