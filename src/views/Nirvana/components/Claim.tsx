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
import { getBalanceNumber } from '../../../utils/formatBalance'
import Spacer from '../../../components/Spacer'

interface ClaimProps {
  pid: number
  name: string
  iconSrc: string
}

const Claim: React.FC<ClaimProps> = ({ pid, name, iconSrc }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const { onAirdrop } = useAirdrop(pid)
  const { totalBalanceReward, rewardAmount, days, hours, minutes, seconds } = useTimer(pid)

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
            {name == "CHILL-ETH" ? 
            <Button
              // disabled={rewardAmount.gt(0) ? false : true}
              disabled={true}
              text={pendingTx ? 'Collecting Reward' : 'Claim Reward'}
              onClick={async () => {
                setPendingTx(true)
                await onAirdrop()
                setPendingTx(false)
              }}
            /> : <Value value="Coming Soon"/> }
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
