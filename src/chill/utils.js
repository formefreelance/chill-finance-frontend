import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getPhaseTimeAndBlocks = async (masterChefContract) => {
  try {
    const phaseDetails  = await masterChefContract.methods
      .getPhaseTimeAndBlocks()
      .call()
    return phaseDetails
  } catch {
    return new BigNumber(0)
  }
}

export const getNirvanaStatus = async (pid, account, masterChefContract) => {
  try {
    const userDetails  = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
      console.log('userDetails===', userDetails.startedBlock)
    const nirvanstatus  = await masterChefContract.methods
      .getNirvanaStatus(userDetails.startedBlock)
      .call()
      console.log('nirvanstatus===', nirvanstatus)
    return nirvanstatus
  } catch {
    return new BigNumber(0)
  }
}

export const getMasterChefAddress = (chill) => {
  return chill && chill.masterChefAddress
}

export const getChillAddress = (chill) => {
  return chill && chill.chillAddress
}

export const getWethContract = (chill) => {
  return chill && chill.contracts && chill.contracts.weth
}

export const getMasterChefContract = (chill) => {
  return chill && chill.contracts && chill.contracts.masterChef
}
export const getChillContract = (chill) => {
  return chill && chill.contracts && chill.contracts.chill
}

export const getAirDropAddress = (chill) => {
  return chill && chill.airdropAddress
}

export const getFarms = (chill) => {
  // console.log('pools===', chill.contracts.pools);
  return chill
    ? chill.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
          iconSrc,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'chill',
          earnTokenAddress: chill.contracts.chill.options.address,
          icon,
          iconSrc,
        }),
      )
    : []
}

export const getAllocPoint = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  return new BigNumber(allocPoint)
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
    console.log('totalAllocPoint: ', new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint).toString()));
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingChill(pid, account).call()
}

export const getBurnedDetails = async (masterChefContract) => {
  return masterChefContract.methods.getBurnedDetails().call()
}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address

  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  // const balance = await lpContract.methods
  //   .balanceOf(masterChefContract.options.address)
  //   .call()

  const balance = await masterChefContract.methods.poolInfo(pid).call();

  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()

  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance.totalPoolBalance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))

  const poolWeight =await getPoolWeight(masterChefContract, pid);
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
    allocPoint: await getAllocPoint(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getChillSupply = async (chill) => {
  return new BigNumber(await chill.contracts.chill.methods.totalSupply().call())
}

export const getChillBalanceOf = async (chill, address) => {
  return new BigNumber(await chill.contracts.chill.methods.balanceOf(address).call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const claimNirvanaIncentive = async (airdropContract, pid, account) => {
  return airdropContract.methods
    .claimNirvanaReward(pid)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}

export const getDaiEthAirDropContract = (chill) => {
  return chill && chill.contracts && chill.contracts.airDropDaiETH
}

export const getDaiEthAirDropAddress = (airdropDaiEthContract) => {
  return airdropDaiEthContract && airdropDaiEthContract.airDropDaiEthAddress
}

export const getDaiEthAirDropRewardAmount = (airdropDaiEthContract) => {
  return airdropDaiEthContract.methods.rewardAmount().call();
}

export const getDaiEthAirDropTimeStamp = (airdropDaiEthContract) => {
  return airdropDaiEthContract.methods.timeStamp().call();
}
