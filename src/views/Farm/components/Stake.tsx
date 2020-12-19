import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Sticker from '../../../components/Sticker'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useRemoveApprove from '../../../hooks/useRemoveApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import useAddLiquidity from '../../../hooks/useAddLiquidity'
import useRemoveLiquidity from "../../../hooks/useRemoveLiquidity";
import useChill from '../../../hooks/useChill'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { getNirvanaStatus, getMasterChefContract } from '../../../chill/utils'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import AddLiquidityModal from './AddLiquidityModal'
import RemoveLiquidityModal from './RemoveLiquidityModal'
import Spacer from '../../../components/Spacer'
import logo from '../../../assets/img/chillicon.png'
import useEthBalance from '../../../hooks/useEthBalance'

interface StakeProps {
  lpContract: Contract
  pid: number
  tokenName: string
  icon: string
  tokenAddress: string
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName, icon, tokenAddress }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requestedRemoveApproval, setRequestedRemoveApproval] = useState(false)
  const [nirvana, setNirvana] = useState<BigNumber>()
  const [nirvanaTax, setNirvanaTax] = useState<BigNumber>()
  const [isNirvana, setIsNirvavna] = useState(false)

  const allowance = useAllowance(lpContract, 0)
  const removeAllowance = useAllowance(lpContract, 1)
  const { onApprove } = useApprove(lpContract)
  const { onRemoveApprove } = useRemoveApprove(lpContract)

  const tokenBalance = useTokenBalance(lpContract.options.address)
  const ethBalance = useEthBalance()
  const stakedBalance = useStakedBalance(pid)

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)
  const { onAddLiquidity } = useAddLiquidity(pid, tokenAddress)
  const { onRemoveLiquidity } = useRemoveLiquidity(tokenAddress)
  const { account } = useWallet()
  const chill = useChill();

  const [onPresentRemoveLiquidity] = useModal(
    <RemoveLiquidityModal
      max={tokenBalance}
      onConfirm={onRemoveLiquidity}
      tokenName={tokenName}
    />,
  )

  const [onPresentAddLiquidity] = useModal(
    <AddLiquidityModal
      max={ethBalance}
      onConfirm={onAddLiquidity}
      tokenName={tokenName}
    />,
  )

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />,
  )
  
  useEffect(() => {
    async function process() {
      const taxArray: number[] = [50, 40, 30, 20, 10, 0];
      const nirvanaRank = await getNirvanaStatus(pid, account, getMasterChefContract(chill))
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

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  const handleRemoveApprove = useCallback(async () => {
    try {
      setRequestedRemoveApproval(true)
      const txHash = await onRemoveApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedRemoveApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedRemoveApproval])


  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
          <Spacer/>
            <CardIcon>‍<img src={icon} style={{ marginTop: -4, width: "120px", height: "120px" }} /></CardIcon>
            {console.log('getBalanceNumber(stakedBalance)===', getBalanceNumber(stakedBalance))}
            <Value value={getBalanceNumber(stakedBalance)} />
            <Label text={`${tokenName} Tokens Staked`} />
            <Label text={`Current level: ${isNirvana ? '5' : Number(nirvana) ? nirvana : '0'  }`} />
            <Label text={`${isNirvana ? '0' : nirvanaTax}% tax on harvest`} />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={`Approve ${tokenName}`}
              />
            ) : (
              <>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0))}
                  text="Unstake"
                  onClick={onPresentWithdraw}
                />
                <StyledActionSpacer />
                <IconButton onClick={onPresentDeposit}>
                  <AddIcon />
                </IconButton>
              </>
            )}
          </StyledCardActions>

          <Spacer/>
          
          { tokenName != "USDT-ETH UNI-V2 LP" ? 
          (
            <>
              <Button
              // disabled={ethBalance.eq(new BigNumber(0))}
              text="Fast Buy LP"
              onClick={onPresentAddLiquidity}
              />
              <StyledCardActions2>
                {!removeAllowance.toNumber() ? (
                  <Button
                    disabled={requestedRemoveApproval}
                    onClick={handleRemoveApprove}
                    text={`Approve Fast Redeem LP`}
                  />
                ) : (
                  <>
                    <Button
                      disabled={tokenBalance.eq(new BigNumber(0))}
                      text="Fast Redeem LP"
                      onClick={onPresentRemoveLiquidity}
                    />
                  </>
                )}
              </StyledCardActions2>             
          </> 
          ) : ''}
          <Spacer/>
          <StyledLink
            target="_blank"
            href={`https://app.uniswap.org/#/add/ETH/${tokenAddress}`}
          >
            <u><Label text={`Get ${tokenName} Tokens`} /></u>
          </StyledLink>
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

const StyledCardActions2 = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[2]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
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

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
  font-size: 13px;
`

export default Stake
