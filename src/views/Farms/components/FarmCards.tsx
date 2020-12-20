import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Sticker from '../../../components/Sticker'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useBlock from '../../../hooks/useBlock'
import useChill from '../../../hooks/useChill'
import useStakedBalance from '../../../hooks/useStakedBalance'
import { getEarned, getMasterChefContract, getNirvanaStatus, getPhaseTimeAndBlocks, getToken0, getReserves, getTotalPoolBalance, getAmountOut, getStaked } from '../../../chill/utils'
import { bnToDec } from '../../../utils'
import { getUniswapV2Library, getUniswapV2Pair } from "../../../utils/uniswap";
import { getTotalSupply } from "../../../utils/erc20";
import { getBalanceNumber } from '../../../utils/formatBalance'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber,
  allocPoint: BigNumber
}

let phaseTime: any;
let phaseBlocks: any;

const FarmCards: React.FC = () => {
  const [farms] = useFarms()
  const { account } = useWallet()
  const block = useBlock()
  const stakedValue = useAllStakedValue()
  const chill = useChill();


  useEffect(() => {
    async function process() {
      getPhaseTimeAndBlocks(getMasterChefContract(chill)).then((_phaseDetails) => {
        phaseTime = _phaseDetails[0]
        phaseBlocks = _phaseDetails[1]
      });
    }
    if (chill && account) {
      process()
    }
  }, [chill]);

  const chillIndex = farms.findIndex(
    ({ tokenSymbol }) => {
      return tokenSymbol === 'CHILL';
    },
  )
  const chillPrice =
    chillIndex >= 0 && stakedValue[chillIndex]
      ? stakedValue[chillIndex].tokenPriceInWeth
      : new BigNumber(0)

  const BLOCKS_PER_YEAR = new BigNumber(phaseTime)
  const CHILL_PER_BLOCK = new BigNumber(phaseBlocks).div(1000000000000000000)

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      console.log("Farm: ", farm)
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? chillPrice
              .times(CHILL_PER_BLOCK)
              .times(BLOCKS_PER_YEAR)
              .times(stakedValue[i].poolWeight)
              .div(stakedValue[i].totalWethValue)
          : null,
        allocPoint: stakedValue[i]
          ? stakedValue[i].allocPoint.div(100)
          : null,
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <StyledLoadingWrapper>
          <Loader text="Finding the cat..." />
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0)
  const [harvestable, setHarvestable] = useState(0)
  const [totalAmount, setTotalAmount] = useState('')
  const [yourShare, setYourShare] = useState('')
  const [nirvana, setNirvana] = useState<BigNumber>()
  const [nirvanaTax, setNirvanaTax] = useState<BigNumber>()
  const [isNirvana, setIsNirvavna] = useState(false)
  const { account } = useWallet()
  const stakedBalance = useStakedBalance(farm.pid)
  const { lpTokenAddress } = farm
  console.log('lpTokenAddress: ', lpTokenAddress)
  const chill = useChill()
  const { ethereum } = useWallet()
  let uniswapV2PairContract;

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchEarned() {
      if (chill) return
      const earned = await getEarned(
        getMasterChefContract(chill),
        lpTokenAddress,
        account,
      )
      setHarvestable(bnToDec(earned))
    }
    if (chill && account) {
      fetchEarned()
    }
  }, [chill, lpTokenAddress, account, setHarvestable])

  
  useEffect(() => {
    async function process() {
      const taxArray: number[] = [50, 40, 30, 20, 10, 0];
      const nirvanaRank = await getNirvanaStatus(farm.pid, account, getMasterChefContract(chill))
      if(getBalanceNumber(stakedBalance) > 0) {
        if(nirvanaRank == 50) {
          setIsNirvavna(true)
        }
        const multiplier = new BigNumber(nirvanaRank).div(10)
        setNirvana(multiplier)
        if (nirvanaRank == 0) {
          setNirvanaTax(new BigNumber(taxArray[0]))
        } else if (nirvanaRank == 10) {
          setNirvanaTax(new BigNumber(taxArray[1]))
        } else if (nirvanaRank == 20) {
          setNirvanaTax(new BigNumber(taxArray[2]))
        } else if (nirvanaRank == 30) {
          setNirvanaTax(new BigNumber(taxArray[3]))
        } else if (nirvanaRank == 40) {
          setNirvanaTax(new BigNumber(taxArray[4]))
        } else {
          setNirvanaTax(new BigNumber(0))
        }
      } else {
        setNirvanaTax(new BigNumber(0))
      }
    }
    if (chill && account) {
      process()
    }
  }, [chill, setNirvana, getBalanceNumber(stakedBalance)]);
  
  useEffect(() => {
    async function process() {
      let totalAmt;
      uniswapV2PairContract = await getUniswapV2Pair(ethereum as provider, lpTokenAddress);
      const token0 = await getToken0(uniswapV2PairContract, account)
      const reserves = await getReserves(uniswapV2PairContract, account)
      const totalSupply = await getTotalSupply(ethereum as provider, lpTokenAddress)
      const totalPoolBalance = await getTotalPoolBalance(getMasterChefContract(chill), farm.pid)
      console.log("UniswapV2-totalPoolBalance: ", totalPoolBalance.toString())
      
      // Toatl pool share in Dollar
      if(token0 == '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
        const tokenBalance = totalPoolBalance.multipliedBy(new BigNumber(reserves._reserve0)).div(new BigNumber(totalSupply))
        const uniswapV2PairContract2 = await getUniswapV2Pair(ethereum as provider, '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852');
        const usdttoken0 = await getToken0(uniswapV2PairContract2, account)
        const usdtreserves = await getReserves(uniswapV2PairContract2, account)
        let stableamount;
        let uniswapLib = await getUniswapV2Library(ethereum as provider, '0x917Ab0455eA95C1313B9B88cd902D99e6a5C6144')
        if(usdttoken0 == "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), new BigNumber(usdtreserves._reserve0), new BigNumber(usdtreserves._reserve1))
        } else {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), usdtreserves._reserve1, usdtreserves._reserve0)
        }
        
        totalAmt = new BigNumber(tokenBalance)
                            .div(new BigNumber(10).pow(18))
                            .multipliedBy(new BigNumber(stableamount).div(new BigNumber(10).pow(6)))
                            .multipliedBy(new BigNumber(2)).toFixed(0)
        setTotalAmount(totalAmt.toString())
      } else {
        const tokenBalance = totalPoolBalance.multipliedBy(new BigNumber(reserves._reserve1)).div(new BigNumber(totalSupply))
        const uniswapV2PairContract2 = await getUniswapV2Pair(ethereum as provider, '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852');
        const usdttoken0 = await getToken0(uniswapV2PairContract2, account)
        const usdtreserves = await getReserves(uniswapV2PairContract2, account)
        let stableamount;
        let uniswapLib = await getUniswapV2Library(ethereum as provider, '0x917Ab0455eA95C1313B9B88cd902D99e6a5C6144')
        if(usdttoken0 == "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), new BigNumber(usdtreserves._reserve0), new BigNumber(usdtreserves._reserve1))
        } else {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), usdtreserves._reserve1, usdtreserves._reserve0)
        }        
        totalAmt = new BigNumber(tokenBalance)
                            .div(new BigNumber(10).pow(18))
                            .multipliedBy(new BigNumber(stableamount).div(new BigNumber(10).pow(6)))
                            .multipliedBy(new BigNumber(2)).toFixed(0)
        setTotalAmount(totalAmt.toString())
      }
    }
    if (chill && account) {
      process()
    }
  }, [chill]);

  // User Share in Dollar
  useEffect(() => {
    async function process() {
      let yourShareInPool;
      uniswapV2PairContract = await getUniswapV2Pair(ethereum as provider, lpTokenAddress);
      const token0 = await getToken0(uniswapV2PairContract, account)
      const reserves = await getReserves(uniswapV2PairContract, account)
      const totalSupply = await getTotalSupply(ethereum as provider, lpTokenAddress)
      const stakedBalance = await getStaked(getMasterChefContract(chill), farm.pid, account)
      
      if(token0 == '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
        const tokenBalance = stakedBalance.multipliedBy(new BigNumber(reserves._reserve0)).div(new BigNumber(totalSupply))
        const uniswapV2PairContract2 = await getUniswapV2Pair(ethereum as provider, '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852');
        const usdttoken0 = await getToken0(uniswapV2PairContract2, account)
        const usdtreserves = await getReserves(uniswapV2PairContract2, account)
        let stableamount;
        let uniswapLib = await getUniswapV2Library(ethereum as provider, '0x917Ab0455eA95C1313B9B88cd902D99e6a5C6144')
        if(usdttoken0 == "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), new BigNumber(usdtreserves._reserve0), new BigNumber(usdtreserves._reserve1))
        } else {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), usdtreserves._reserve1, usdtreserves._reserve0)
        }        
        yourShareInPool = new BigNumber(tokenBalance)
                            .div(new BigNumber(10).pow(18))
                            .multipliedBy(new BigNumber(stableamount).div(new BigNumber(10).pow(6)))
                            .multipliedBy(new BigNumber(2)).toFixed(0)
        setYourShare(yourShareInPool.toString())
      } else {
        const tokenBalance = stakedBalance.multipliedBy(new BigNumber(reserves._reserve1)).div(new BigNumber(totalSupply))
        const uniswapV2PairContract2 = await getUniswapV2Pair(ethereum as provider, '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852');
        const usdttoken0 = await getToken0(uniswapV2PairContract2, account)
        const usdtreserves = await getReserves(uniswapV2PairContract2, account)
        let stableamount;
        let uniswapLib = await getUniswapV2Library(ethereum as provider, '0x917Ab0455eA95C1313B9B88cd902D99e6a5C6144')
        if(usdttoken0 == "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), new BigNumber(usdtreserves._reserve0), new BigNumber(usdtreserves._reserve1))
        } else {
          stableamount = await getAmountOut(uniswapLib, new BigNumber(10).pow(18), usdtreserves._reserve1, usdtreserves._reserve0)
        }        
        yourShareInPool = new BigNumber(tokenBalance)
                            .div(new BigNumber(10).pow(18))
                            .multipliedBy(new BigNumber(stableamount).div(new BigNumber(10).pow(6)))
                            .multipliedBy(new BigNumber(2)).toFixed(0)
        setYourShare(yourShareInPool.toString())
      }
    }
    if (chill && account) {
      process()
    }
  }, [chill]);

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  return (
    <StyledCardWrapper>
      {farm.tokenSymbol === 'CHILL' && <StyledCardAccent />}
      <Card>
      {farm.tokenSymbol === 'CHILL' && 
        <StyledAllocPoint><StyledCardIcon>🌟 8x</StyledCardIcon></StyledAllocPoint> 
      }
        <CardContent>
          <StyledContent>
          <StyledCardActions>
          <Sticker>{farm.allocPoint ? `${farm.allocPoint}x` : '0x'}</Sticker>
          <StyledActionSpacer />
          { isNirvana ? 
            <StyledDetail2>{`Nirvana! Congrats`}</StyledDetail2> : 
            <StyledDetail3>{`Chilling...`}</StyledDetail3>
          }
          </StyledCardActions>
          <Spacer/>
            <CardIcon>{farm.icon}</CardIcon>
            <StyledTitle>{farm.name}</StyledTitle>
            {/* <StyledTitle>{totalAmount}</StyledTitle> */}
            <StyledDetails>
              <StyledDetail>Total Pool Balance: ${totalAmount ? totalAmount : 0}</StyledDetail>
              <StyledDetail>Your Share: ${yourShare ? yourShare : 0}</StyledDetail>
              <StyledDetail>Deposit {farm.lpToken.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn {farm.earnToken.toUpperCase()}</StyledDetail>
            </StyledDetails>
            <Spacer />
            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/farms/${farm.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            <StyledInsight>
              <span>APY</span>
              <span>
                {farm.apy
                  ? `${farm.apy
                      .times(new BigNumber(100))
                      .toNumber()
                      .toLocaleString('en-US')
                      .slice(0, -1)}%`
                  : 'Loading ...'}
              </span>
              {/* <span>
                {farm.tokenAmount
                  ? (farm.tokenAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                {farm.tokenSymbol}
              </span>
              <span>
                {farm.wethAmount
                  ? (farm.wethAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                ETH
              </span> */}
            </StyledInsight>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}


const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledAllocPoint = styled.div`
  font-family: 'Kaushan Script', sans-serif;
  color: ${(props) => props.theme.color.grey[500]};
  margin-top: -20px;
  margin-left: -15px;
  font-size: 30px;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`

const StyledDetail2 = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  filter: blur(0.1px);

  color: ${(props) => props.theme.color.grey[500]};  
  background-color: ${props => props.theme.color.grey[200]};
  height: 40px;
  width: 160px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  animation: ${RainbowLight} 2s linear infinite;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
  inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  margin-top: 8px;
`

const StyledDetail3 = styled.div`
  color: ${(props) => props.theme.color.grey[500]};  
  background-color: ${props => props.theme.color.grey[200]};
  height: 40px;
  width: 160px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
  inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  margin-top: 8px;
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #fffdfa;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #e6dcd5;
  text-align: center;
  padding: 0 12px;
`

const StyledCardIcon = styled.div`
  color: ${(props) => props.theme.color.grey[600]};
  background-color: ${props => props.theme.color.grey[200]};
  height: 50px;
  width: 100px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
    inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  margin: 0 auto ${props => props.theme.spacing[3]}px;
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;`

export default FarmCards
