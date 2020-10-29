import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useEffect } from 'react'
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
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import useChill from '../../../hooks/useChill'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { getNirvanaStatus, getMasterChefContract } from '../../../chill/utils'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import Spacer from '../../../components/Spacer'

interface StakeProps {
  lpContract: Contract
  pid: number
  tokenName: string
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [nirvana, setNirvana] = useState<BigNumber>()
  const [isNirvana, setIsNirvavna] = useState(false)



  const allowance = useAllowance(lpContract)
  const { onApprove } = useApprove(lpContract)

  const tokenBalance = useTokenBalance(lpContract.options.address)
  const stakedBalance = useStakedBalance(pid)

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)
  const { account } = useWallet()
  const chill = useChill();

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
      const nirvanstatus = await getNirvanaStatus(pid, account, getMasterChefContract(chill))
      if(getBalanceNumber(stakedBalance) > 0) {
        if(nirvanstatus == 50) {
          setIsNirvavna(true)
        }
        const multiplier = new BigNumber(nirvanstatus).div(100).plus(1)
        setNirvana(multiplier)
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


  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
          {/* <Sticker>{`${isNirvana ? 'Nirvana' : Number(nirvana) === 50 ? 'Nirvana' : nirvana }`}</Sticker> */}
          <Spacer/>
            <CardIcon>👨🏻‍🍳</CardIcon>
            {console.log('getBalanceNumber(stakedBalance)===', getBalanceNumber(stakedBalance))}
            <Value value={getBalanceNumber(stakedBalance)} />
            <Label text={`${tokenName} Tokens Staked`} />
            <Label text={`Multiplier Status: ${isNirvana ? 'Nirvana Stage-1.5' : Number(nirvana) ? nirvana : '1'  }%`} />
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

export default Stake
