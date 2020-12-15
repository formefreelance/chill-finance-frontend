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
import { getNirvanaStatus, getMasterChefContract, getDaiEthAirDropScheduleAttend, getNirvana, getUserAmount } from '../../../chill/utils'
import { airDropAddresses } from '../../../chill/lib/constants'
import { getAirDropContract } from '../../../utils/airdrop'
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
  const { onAirdrop } = useAirdrop(pid)
  const { totalBalanceReward, rewardAmount, days, hours, minutes, seconds } = useTimer(pid)
  
  useEffect(() => {
    async function process() {
      let airdropContract;
      console.log('pid:-- ', pid)
      const networkId = 1;
      const nirvanaRank = await getNirvanaStatus(pid, account, getMasterChefContract(chill))
      const userAmount = await getUserAmount(pid, account, getMasterChefContract(chill))
      if(userAmount > 0) {
        console.log('userAmount', pid, userAmount)
        setIsUserHasAmount(true)
      }
      if (pid == 0) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.chillEth[networkId]);
      } else if (pid == 1) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.daiEth[networkId]);
      } else if (pid == 2) {
        airdropContract = await getAirDropContract(ethereum as provider, airDropAddresses.usdtEth[networkId]);
      }
      const scheduleAttend = await getDaiEthAirDropScheduleAttend(airdropContract, account)
      // const isNirva = await getNirvana(airdropContract, pid)

      if(scheduleAttend == true) {
        console.log('scheduleAttend: ', pid, scheduleAttend)
        setIsScheduleAttend(true)
      }
        if(nirvanaRank == 50) {
          console.log('nirvanaRank:-- ', pid, nirvanaRank)
          setIsNirvavna(true)
        }
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
            <Label text="Current Reward Session" />
            <Value value={getBalanceNumber(rewardAmount)} />
            <Spacer/>
            <Label text="Time Until Session" />
            <Label text={`${days.toString()} Days : ${hours.toString()} Hours : ${minutes.toString()} Minutes : ${seconds.toString()} Seconds`} />
          </StyledCardHeader>
          <StyledCardActions>
            {console.log('isNirvana:++', isNirvana)}
            
            {/* { name== "CHILL-ETH" && isNirvana && !isScheduleAttend && isAmount ?  */}
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
                {/* // : 
              //   <Button
              //   disabled={true}
              //   text={'You are not in Nirvana or already claimed!'}
              //   onClick={async () => {
              //     setPendingTx(true)
              //     await onAirdrop()
              //     setPendingTx(false)
              // }}
              // />
            // } */}
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
