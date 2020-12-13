import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import useChill from '../../../hooks/useChill'
import { useWallet } from 'use-wallet'
import useBlock from '../../../hooks/useBlock'
import { getBalanceNumber } from '../../../utils/formatBalance'
import chillicon from "../../../assets/img/chillicon.png";
import { getUserStartedBlock, getMasterChefContract } from "../../../chill/utils";
import BigNumber from 'bignumber.js'
import Spacer from '../../../components/Spacer'

interface HarvestProps {
  pid: number
}

let interval;

const Harvest: React.FC<HarvestProps> = ({ pid }) => {
  const earnings = useEarnings(pid)
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useReward(pid)

  const { account } = useWallet()
  const chill = useChill();
  const block = useBlock()
  const [timeStamp, setTimeStamp] = useState(Number)
  const [days, setDays] = useState(Number)
  const [hours, setHours] = useState(Number)
  const [minutes, setMinutes] = useState(Number)
  const [seconds, setSeconds] = useState(Number)
  
  useEffect(() => {
    async function process() {
      if(block && timeStamp == 0) {
        const startedBlock = await getUserStartedBlock(pid, account, getMasterChefContract(chill))
        const time = Math.floor(Date.now() / 1000)
        console.log('startedBlock: ', time)
        const diffBlock = new BigNumber(block).minus(new BigNumber(startedBlock))
        console.log('diffBlock: ', diffBlock.toString())

        let totalBlocksRest;
        let timeStamp;
        if (diffBlock.lt(new BigNumber(2201))) {
          totalBlocksRest = new BigNumber(2201).minus(diffBlock)
        } else if (diffBlock.lt(new BigNumber(4402))) {
          totalBlocksRest = new BigNumber(4402).minus(diffBlock)
        } else if (diffBlock.lt(new BigNumber(6603))) {
          totalBlocksRest = new BigNumber(6603).minus(diffBlock)
        } else if (diffBlock.lt(new BigNumber(8804))) {
          totalBlocksRest = new BigNumber(8804).minus(diffBlock)
        } else if (diffBlock.lt(new BigNumber(11005))) {
          totalBlocksRest = new BigNumber(11005).minus(diffBlock)
        } else {
          setTimeStamp(0);
        }
        timeStamp = new BigNumber(totalBlocksRest).multipliedBy(new BigNumber(28800)).div(new BigNumber(2201))
        const totalTimeStamp = new BigNumber(timeStamp).plus(new BigNumber(time))
        setTimeStamp(totalTimeStamp.toNumber());
      } else {
        console.log('startedBlock: ', "NoTime")
      }
    }
    if (chill && account) {
      process()
    }
  }, [chill, block]);
  
  useEffect(() => {
    async function timer() {
      interval = setInterval(() => {
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
    if (chill && account) {
        clearInterval(interval)
        timer()
    }
  }, [chill, timeStamp]);
  
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
          <CardIcon><img src={chillicon} style={{ marginTop: -4, width: "120px", height: "120px" }} /></CardIcon>
            <Value value={getBalanceNumber(earnings)} />
            <Label text="CHILL Earned" />
          </StyledCardHeader>
          <StyledCardHeader2>

          {/* <StyledCardActions> */}
            <Button
              disabled={!earnings.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting CHILL' : 'Harvest'}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            />
          {/* </StyledCardActions> */}
            <Spacer size="sm"/>
            <Label text="Time to complete this tax phase" />
            <Label text={`${days.toString()} Days : ${hours.toString()} Hours : ${minutes.toString()} Minutes : ${seconds.toString()} Seconds`} />
          </StyledCardHeader2>
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
const StyledCardHeader2 = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 12px;
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

export default Harvest
