import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import ChillIcon from '../../../components/ChillIcon'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useChill from '../../../hooks/useChill'
import { getMasterChefContract, getBurnedDetails } from '../../../chill/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  const [farms] = useFarms()
  const allStakedValue = useAllStakedValue()

  if (allStakedValue && allStakedValue.length) {
    const sumWeth = farms.reduce(
      (c, { id }, i) => c + (allStakedValue[i].totalWethValue.toNumber() || 0),
      0,
    )
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}


let phaseTime: any;
let phaseBlocks: any;

const Burned: React.FC = () => {
  const [lastDayBurned, setLastDayBurned] = useState<BigNumber>()
  const [totalBurned, setTotalBurned] = useState<BigNumber>()

  const chill = useChill()
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  useEffect(() => {
    async function fetchBurnDetails() {
        getBurnedDetails(getMasterChefContract(chill)).then((_burnDetails) => {
          if (_burnDetails[0] == "0") {
              console.log("Burned====1: ", _burnDetails[0])
              console.log("Burned====2: ", _burnDetails[1], _burnDetails[2], _burnDetails[3])
              if(_burnDetails[1] == "0") {
                setLastDayBurned(new BigNumber(_burnDetails[3].toString()))
              } else {
                setLastDayBurned(new BigNumber(_burnDetails[1].toString()))
              }
          } else {
            setLastDayBurned(new BigNumber(_burnDetails[2].toString()))
          }
          setTotalBurned(new BigNumber(_burnDetails[3].toString()))
        });
    }
    if (chill) {
      fetchBurnDetails()
    }
  }, [chill, setLastDayBurned, setTotalBurned])

  return (
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <Spacer />
              <div style={{ flex: 1 }}>
                <Label text="Last Day Burned(24 hours)" />
                <Value
                  value={lastDayBurned ? getBalanceNumber(lastDayBurned) : 'Locked'}
                />
              </div>
            </StyledBalance>
          </StyledBalances>
        </CardContent>
      </Card>
      <Spacer />

      <Card>
        <CardContent>
          <Label text="Total Burned supply" />
          <Value
            value={totalBurned ? getBalanceNumber(totalBurned) : 'Locked'}
          />
        </CardContent>
      </Card>
    </StyledWrapper>
  )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.grey[400]};
  border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Burned
