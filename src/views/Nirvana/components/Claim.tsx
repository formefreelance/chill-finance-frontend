import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAirdrop from '../../../hooks/useAirdrop'
import useTimer from '../../../hooks/useTimer'
// import useChill from '../../../hooks/useChill'
import { getBalanceNumber } from '../../../utils/formatBalance'
// import { getDaiEthAirDropRewardAmount, getDaiEthAirDropContract, getChillBalanceOf, getDaiEthAirDropTimeStamp } from '../../../chill/utils'
// import BigNumber from 'bignumber.js'
// import { airDropAddresses } from '../../../chill/lib/constants'
import Spacer from '../../../components/Spacer'

interface ClaimProps {
  pid: number
  name: string
  iconSrc: string
}

const Claim: React.FC<ClaimProps> = ({ pid, name, iconSrc }) => {
  // const [rewardAmount, setReward] = useState(new BigNumber(0))
  // const [totalBalanceReward, setTotalBalanceReward] = useState(new BigNumber(0))
  // const [timeStamp, setTimeStamp] = useState(Number)
  // const [days, setDays] = useState(Number)
  // const [hours, setHours] = useState(Number)
  // const [minutes, setMinutes] = useState(Number)
  // const [seconds, setSeconds] = useState(Number)

  const [pendingTx, setPendingTx] = useState(false)
  const { onAirdrop } = useAirdrop(pid)
  // const chill = useChill()
  const { totalBalanceReward, rewardAmount, days, hours, minutes, seconds } = useTimer(pid)
  console.log('nirvanaDetails1: ', totalBalanceReward)

  // useEffect(() => {
  //   async function getReward() {
  //     let airdropContract;
  //     if (pid == 0) {
  //       const networkId = 1;
  //       airdropContract = getDaiEthAirDropContract(chill);
  //       const totalBalanceRewards = await getChillBalanceOf(chill, airDropAddresses.daiEth[networkId]);
  //       setTotalBalanceReward(new BigNumber(totalBalanceRewards))
  //     }
  //     if(airdropContract) {
  //       getDaiEthAirDropRewardAmount(airdropContract).then((reward) => {
  //         setReward(new BigNumber(reward));
  //       });
  //       getDaiEthAirDropTimeStamp(airdropContract).then((timeStamp) => {
  //         setTimeStamp(timeStamp);
  //       });
  //     }
  //   }
  //   if (chill) {
  //     getReward()
  //   }
  // }, [chill]);

  // useEffect(() => {
  //   async function timer() {
  //     const x = setInterval(() => {
  //       if(timeStamp>0) {
  //       const now = new Date().getTime();
  //       const distance = (timeStamp*1000) - now;
  //       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //       const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //       setDays(days)
  //       setHours(hours)
  //       setMinutes(minutes)
  //       setSeconds(seconds)
  //         if (distance < 0) {
  //           setDays(0)
  //           setHours(0)
  //           setMinutes(0)
  //           setSeconds(0)
  //         }
  //       }
  //     }, 1000);
  //   }
  //   if (chill) {
  //     timer()
  //   }
  // }, [chill, timeStamp]);

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>{<img src={iconSrc} style={{ marginTop: -4, width: "120px", height: "90px" }} />}</CardIcon>
            <StyledTitle>{name}</StyledTitle>
            <Label text="Total Reward Pool" />
            <Value value={getBalanceNumber(totalBalanceReward)} />
            <Spacer/>
            <Label text="Current Reward Session" />
            <Value value={getBalanceNumber(rewardAmount)} />
            <Spacer/>
            <Label text="Time Until Session" />
            <Label text={`${days.toString()} : ${hours.toString()} : ${minutes.toString()} : ${seconds.toString()} `} />
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={rewardAmount.gt(0) ? false : true}
              text={pendingTx ? 'Collecting Reward' : 'Claim Reward'}
              onClick={async () => {
                setPendingTx(true)
                await onAirdrop()
                setPendingTx(false)
              }}
            />
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
