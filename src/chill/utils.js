import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getWeb3 } from "../utils/erc20";

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
    const phaseDetails = await masterChefContract.methods
      .getPhaseTimeAndBlocks()
      .call()
    return phaseDetails
  } catch {
    return new BigNumber(0)
  }
}

export const getNirvanaStatus = async (pid, account, masterChefContract) => {
  try {
    const userDetails = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    const nirvanstatus = await masterChefContract.methods
      .getNirvanaStatus(userDetails.startedBlock)
      .call()
    return nirvanstatus
  } catch {
    return new BigNumber(0)
  }
}

export const getUserStartedBlock = async (pid, account, masterChefContract) => {
  try {
    const { startedBlock } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return startedBlock
  } catch {
    return new BigNumber(0)
  }
}

export const getUserAmount = async (pid, account, masterChefContract) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return amount
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

export const getTotalPoolBalance = async (masterChefContract, pid) => {
  const { totalPoolBalance } = await masterChefContract.methods.poolInfo(pid).call()
  return new BigNumber(totalPoolBalance)
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

  const poolWeight = await getPoolWeight(masterChefContract, pid);
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
    allocPoint: await getAllocPoint(masterChefContract, pid),
  }
}

export const approve = async (lpContract, approvalContract, account) => {
  return lpContract.methods
    .approve(approvalContract.options.address, ethers.constants.MaxUint256)
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

export const getInstaStakeContract = (chill) => {
  return chill && chill.contracts && chill.contracts.instaStake
}

export const getUniswapRouterContract = (chill) => {
  return chill && chill.contracts && chill.contracts.uniswapRouter
}

export const addLiquidity = async (instaStakeContract, tokenAddress, amount, account, web3provider) => {
  const web3 = await getWeb3(web3provider)
  console.log('tokenAddress', tokenAddress)
  return instaStakeContract.methods
    .deposit(
      tokenAddress,
      ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', tokenAddress]
    )
    .send({ from: account, value: web3.utils.toWei(amount) })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const removeLiquidity = async (uniswapRouterContract, tokenAddress, amount, account, web3provider) => {
  let now = new Date().getTime() / 1000
  const web3 = await getWeb3(web3provider)
  console.log('uniswapRouterContract: ',uniswapRouterContract);
  return uniswapRouterContract.methods.removeLiquidity(
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      tokenAddress,
      web3.utils.toWei(amount),
      new BigNumber(0),
      new BigNumber(0),
      account,
      new BigNumber(now)
    )
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

export const getDaiEthAirDropScheduleAttend =  async(airdropDaiEthContract, account) => {
  const scheduleCount = await airdropDaiEthContract.methods.scheduleCount().call(); 
  return airdropDaiEthContract.methods.isNewRewardGiven(scheduleCount, account).call();
}

export const getDaiEthAirDropNextScheduleAttend =  async(airdropDaiEthContract, account) => {
  const scheduleCount = await airdropDaiEthContract.methods.scheduleCount().call(); 
  console.log("scheduleCount: ", scheduleCount)
  return airdropDaiEthContract.methods.isNewRewardGiven(new BigNumber(scheduleCount).plus(new BigNumber(1)), account).call();
}

export const getNirvana =  async(airdropDaiEthContract, pid) => {
  return airdropDaiEthContract.methods.getNirvana(pid).call();
}

export const getDaiEthAirDropTimeStamp = (airdropDaiEthContract) => {
  return airdropDaiEthContract.methods.timeStamp().call();
}

export const getToken0 = async (uniswapV2PairContract, account) => {
  return uniswapV2PairContract.methods
    .token0()
    .call()
}

export const getReserves = async (uniswapV2PairContract, account) => {
  return uniswapV2PairContract.methods
    .getReserves()
    .call()
}

export const getAmountOut = async (uniswapV2LibContract, amount, res0, res1) => {
  return uniswapV2LibContract.methods
    .getAmountOut(amount, res0, res1)
    .call()
}
