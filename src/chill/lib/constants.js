import React from 'react'
import BigNumber from 'bignumber.js/bignumber'
import cat1 from "../../assets/img/cat1.png";
import cat2 from "../../assets/img/cat2.png";
import cat3 from "../../assets/img/cat3-c.png";
import cat4 from "../../assets/img/cat4-c.png";
import cat5 from "../../assets/img/cat5-c.png";

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

// export const addressMap = {
//   uniswapFactory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
//   uniswapFactoryV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
//   YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
//   YCRV: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
//   UNIAmpl: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
//   WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//   UNIRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
//   LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
//   MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
//   SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
//   COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
//   LEND: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
//   CHILLYCRV: '0x2C7a51A357d5739C5C74Bf3C96816849d2c9F726',
// }

export const contractAddresses = {
  // chill: {
  //   42: '0xC059Ab991c99D2c08A511F8e04EE5EA85a2e97bf',
  // },
  // masterChef: {
  //   42: '0xa15E697806711003E635bEe08CA049130C4917fd',
  // },
  // weth: {
  //   42: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  // }
  chill: {
    1: '0xD6689f303fA491f1fBba919C1AFa619Bd8E595e3',
  },
  masterChef: {
    1: '0x4ad97fd79F8a2aE0e5415821BC06781bF5a164e1',
  },
  weth: {
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  }
}

// Kovan
// export const airDropAddresses = {
//   daiEth: {
//     42: '0x19891522E6CC5644C4DD4c238e89Afc974Ec31d8',
//   }, chillEth: {
//     42: '0x19891522E6CC5644C4DD4c238e89Afc974Ec31d8',
//   }, usdtEth: {
//     42: '0x19891522E6CC5644C4DD4c238e89Afc974Ec31d8',
//   }
// }

// Mainnet
export const airDropAddresses = {
  chillEth: {
    1: '0xF6F13e0a724b48246aC575635D1198A1148A25f6',
  }, usdtEth: {
    1: '0xFeCFc33DFD0B3d3AF1E7B98D70AF68941EbccD3b',
  }, daiEth: {
    1: '0x7F80d7f7F27E033d9ce1BE5b012520fE91486E6E',
  }
}

// Kovan
// export const instaStakeAddress = {
//   instaStake: {
//     42: '0x5BC084725FCED5c57EC7E607f187B199D9FcFf16',
//   }
// }

// Mainnet
export const instaStakeAddress = {
  instaStake: {
    1: '0xB5B4c41ed9bA8B796e88D6b15b5D9a5334292e22',
  }
}

// Kovan
// export const uniswapRouterAddresses = {
//   uniswapRouterAddress: {
//     42: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
//   }
// }

// Mainnet
export const uniswapRouterAddresses = {
  uniswapRouterAddress: {
    1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  }
}


/*
UNI-V2 LP Address on mainnet for reference
==========================================
0  USDT 0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852
1  USDC 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc
2  DAI  0xa478c2975ab1ea89e8196811f51a7b7ade33eb11
3  sUSD 0xf80758ab42c3b07da84053fd88804bcb6baa4b5c
4  COMP 0xcffdded873554f362ac02f8fb1f02e5ada10516f
5  LEND 0xab3f9bf1d81ddb224a2014e98b238638824bcf20
6  SNX  0x43ae24960e5534731fc831386c07755a2dc33d47
7  UMA  0x88d97d199b9ed37c29d846d00d443de980832a22
8  LINK 0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974
9  BAND 0xf421c3f2e695c2d4c0765379ccace8ade4a480d9
10 AMPL 0xc5be99a02c6857f9eac67bbce58df5572498f40c
11 YFI  0x2fdbadf3c4d5a8666bc06645b8358ab803996e28
12 CHILL 0xce84867c3c02b05dc570d0135103d3fb9cc19433
*/

// stakingRewardsDaiETH: 0x3cb2425D0c307A9a8E18026d780CEf8dBCd64Cd1
// unitoken: 0x7C3C162D635BF988e3842F5A58d83e3cdcc453fb

// Kovan
// export const supportedPools = [
//   {
//     pid: 0,
//     lpAddresses: {
//       42: '0xBbB8eeA618861940FaDEf3071e79458d4c2B42e3',
//     },
//     tokenAddresses: {
//       42: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
//     },
//     name: 'DAI-ETH',
//     symbol: 'DAI-ETH UNI-V2 LP',
//     tokenSymbol: 'DAI',
//     iconSrc: cat4,
//     icon: <img src={cat4} style={{ marginTop: -4, width: "120px", height: "120px" }} />,
//   },
//   {
//     pid: 1,
//     lpAddresses: {
//       42: '0x895304AC31f3fA5D8b215d7B04cC6C2D0677E0b0',
//     },
//     tokenAddresses: {
//       42: '0xC059Ab991c99D2c08A511F8e04EE5EA85a2e97bf',
//     },
//     name: 'CHILL-ETH',
//     symbol: 'CHILL-ETH UNI-V2 LP',
//     tokenSymbol: 'CHILL',
//     iconSrc: cat5,
//     icon: <img src={cat5} style={{ marginTop: -4, width: "120px", height: "120px" }} />,
//   },
//   {
//     pid: 2,
//     lpAddresses: {
//       42: '0x3C30B799bB64485FDB52f249DA0e74F67f35b5E7',
//     },
//     tokenAddresses: {
//       42: '0xd3a691c852cdb01e281545a27064741f0b7f6825',
//     },
//     name: 'BTC-ETH',
//     symbol: 'BTC-ETH UNI-V2 LP',
//     tokenSymbol: 'BTC',
//     iconSrc: cat3,
//     icon: <img src={cat3} style={{ marginTop: -4, width: "120px", height: "120px" }} />,
//   },
// ]

// Mainnet
export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      1: '0xddBDfb8FAc34863fd97e6ff52B95cF257C3c2721',
    },
    tokenAddresses: {
      1: '0xD6689f303fA491f1fBba919C1AFa619Bd8E595e3',
    },
    name: 'CHILL-ETH',
    symbol: 'CHILL-ETH UNI-V2 LP',
    tokenSymbol: 'CHILL',
    iconSrc: cat5,
    icon: <img src={cat5} style={{ marginTop: -4, width: "120px", height: "120px" }} />,
  },
  {
    pid: 1,
    lpAddresses: {
      1: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
    },
    tokenAddresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    name: 'USDT-ETH',
    symbol: 'USDT-ETH UNI-V2 LP',
    tokenSymbol: 'USDT',
    iconSrc: cat4,
    icon: <img src={cat4} style={{ marginTop: -4, width: "120px", height: "120px" }} />,
  },
  {
    pid: 2,
    lpAddresses: {
      1: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
    },
    tokenAddresses: {
      1: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    name: 'DAI-ETH',
    symbol: 'DAI-ETH UNI-V2 LP',
    tokenSymbol: 'DAI',
    iconSrc: cat3,
    icon: <img src={cat3} style={{ marginTop: -4, width: "120px", height: "120px" }} />,
  },
]