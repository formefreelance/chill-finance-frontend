import BigNumber from 'bignumber.js/bignumber'
import chef from "../../assets/img/chef.png";
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

// Kovan chill-eth uni v2 : 0x3304b9DD0adA7F9E5f0F47e6cCE2a988cBceC6BE
export const contractAddresses = {
  // chill: {
  //   42: '0xDa4c100dfc76E8E8532c9dBEd93485998b278F7c',
  // },
  // masterChef: {
  //   42: '0xf609c052879BD0c3d4e9407E88ABeaadE509c20D',
  // },
  // weth: {
  //   42: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  // },
  chill: {
    42: '0x58A2bC3cEB8fb401572d85dC7Bf6fB3Ac0476E0c',
  },
  masterChef: {
    42: '0xe4e8A668573dF6D7459A1cFA6C4f58ACFdF4F177',
  },
  weth: {
    42: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  },
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

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      42: '0xBbB8eeA618861940FaDEf3071e79458d4c2B42e3',
    },
    tokenAddresses: {
      42: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
    },
    name: 'DAI-ETH PARTY!',
    symbol: 'DAI-ETH UNI-V2 LP',
    tokenSymbol: 'DAI',
    icon: '🍣',
  },
  {
    pid: 1,
    lpAddresses: {
      42: '0xfF88A4E347c04dcC69e2368D8Ec092aFf3d792f7',
    },
    tokenAddresses: {
      42: '0x58A2bC3cEB8fb401572d85dC7Bf6fB3Ac0476E0c',
    },
    name: 'Donald CHILL',
    symbol: 'CHILL-ETH UNI-V2 LP',
    tokenSymbol: 'CHILL',
    icon: '🦆',
  },
  {
    pid: 2,
    lpAddresses: {
      42: '0x3C30B799bB64485FDB52f249DA0e74F67f35b5E7',
    },
    tokenAddresses: {
      42: '0xd3a691c852cdb01e281545a27064741f0b7f6825',
    },
    name: 'Circle Snail',
    symbol: 'BTC-ETH UNI-V2 LP',
    tokenSymbol: 'BTC',
    icon: '🐌',
  },
  
  // {
  //   pid: 0,
  //   lpAddresses: {
  //     42: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
  //   },
  //   tokenAddresses: {
  //     42: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //   },
  //   name: 'Tether Turtle',
  //   symbol: 'USDT-ETH UNI-V2 LP',
  //   tokenSymbol: 'USDT',
  //   icon: '🐢',
  // },
  // {
  //   pid: 3,
  //   lpAddresses: {
  //     42: '0xf80758ab42c3b07da84053fd88804bcb6baa4b5c',
  //   },
  //   tokenAddresses: {
  //     42: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  //   },
  //   name: 'Spartan Dollar',
  //   symbol: 'SUSD-ETH UNI-V2 LP',
  //   tokenSymbol: 'SUSD',
  //   icon: '🦍',
  // },
  // {
  //   pid: 7,
  //   lpAddresses: {
  //     42: '0x88d97d199b9ed37c29d846d00d443de980832a22',
  //   },
  //   tokenAddresses: {
  //     42: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  //   },
  //   name: 'Umami Squid',
  //   symbol: 'UMA-ETH UNI-V2 LP',
  //   tokenSymbol: 'UMA',
  //   icon: '🦑',
  // },
  // {
  //   pid: 9,
  //   lpAddresses: {
  //     42: '0xf421c3f2e695c2d4c0765379ccace8ade4a480d9',
  //   },
  //   tokenAddresses: {
  //     42: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
  //   },
  //   name: 'Band-osaurus',
  //   symbol: 'BAND-ETH UNI-V2 LP',
  //   tokenSymbol: 'BAND',
  //   icon: '🦖',
  // },
  // {
  //   pid: 8,
  //   lpAddresses: {
  //     42: '0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974',
  //   },
  //   tokenAddresses: {
  //     42: '0x514910771af9ca656af840dff83e8264ecf986ca',
  //   },
  //   name: 'Toadie Marine',
  //   symbol: 'LINK-ETH UNI-V2 LP',
  //   tokenSymbol: 'LINK',
  //   icon: '🐸',
  // },
  // {
  //   pid: 10,
  //   lpAddresses: {
  //     42: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
  //   },
  //   tokenAddresses: {
  //     42: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
  //   },
  //   name: 'Ample Chicks',
  //   symbol: 'AMPL-ETH UNI-V2 LP',
  //   tokenSymbol: 'AMPL',
  //   icon: '🐥',
  // },
  // {
  //   pid: 4,
  //   lpAddresses: {
  //     42: '0xcffdded873554f362ac02f8fb1f02e5ada10516f',
  //   },
  //   tokenAddresses: {
  //     42: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  //   },
  //   name: 'Compound Truffle',
  //   symbol: 'COMP-ETH UNI-V2 LP',
  //   tokenSymbol: 'COMP',
  //   icon: '🍄',
  // },
  // {
  //   pid: 5,
  //   lpAddresses: {
  //     42: '0xab3f9bf1d81ddb224a2014e98b238638824bcf20',
  //   },
  //   tokenAddresses: {
  //     42: '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
  //   },
  //   name: 'Aave Boar',
  //   symbol: 'LEND-ETH UNI-V2 LP',
  //   tokenSymbol: 'LEND',
  //   icon: '🐗',
  // },
  // {
  //   pid: 6,
  //   lpAddresses: {
  //     42: '0x43ae24960e5534731fc831386c07755a2dc33d47',
  //   },
  //   tokenAddresses: {
  //     42: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  //   },
  //   name: 'Synthetic Snake',
  //   symbol: 'SNX-ETH UNI-V2 LP',
  //   tokenSymbol: 'SNX',
  //   icon: '🐍',
  // },
  // {
  //   pid: 11,
  //   lpAddresses: {
  //     42: '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28',
  //   },
  //   tokenAddresses: {
  //     42: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
  //   },
  //   name: 'YFI Whale',
  //   symbol: 'YFI-ETH UNI-V2 LP',
  //   tokenSymbol: 'YFI',
  //   icon: '🐋',
  // },
  // {
  //   pid: 13,
  //   lpAddresses: {
  //     42: '0x8bd1661da98ebdd3bd080f0be4e6d9be8ce9858c',
  //   },
  //   tokenAddresses: {
  //     42: '0x408e41876cccdc0f92210600ef50372656052a38',
  //   },
  //   name: 'REN Rhino',
  //   symbol: 'REN-ETH UNI-V2 LP',
  //   tokenSymbol: 'REN',
  //   icon: '🦏',
  // },
  // {
  //   pid: 14,
  //   lpAddresses: {
  //     42: '0xaad22f5543fcdaa694b68f94be177b561836ae57',
  //   },
  //   tokenAddresses: {
  //     42: '0x68A118Ef45063051Eac49c7e647CE5Ace48a68a5',
  //   },
  //   name: 'BASED Bull',
  //   symbol: 'BASE-sUSD UNI-V2 LP',
  //   tokenSymbol: 'BASED',
  //   icon: '🐂',
  // },
  // {
  //   pid: 15,
  //   lpAddresses: {
  //     42: '0xcc3d1ecef1f9fd25599dbea2755019dc09db3c54',
  //   },
  //   tokenAddresses: {
  //     42: '0x476c5E26a75bd202a9683ffD34359C0CC15be0fF',
  //   },
  //   name: 'SRM Shark',
  //   symbol: 'SRM-ETH UNI-V2 LP',
  //   tokenSymbol: 'SRM',
  //   icon: '🦈',
  // },
  // {
  //   pid: 16,
  //   lpAddresses: {
  //     42: '0xa5904961f61bae7c4dd8478077556c91bf291cfd',
  //   },
  //   tokenAddresses: {
  //     42: '0xaba8cac6866b83ae4eec97dd07ed254282f6ad8a',
  //   },
  //   name: 'CHILLv2 CHILL',
  //   symbol: 'CHILLv2-ETH UNI-V2 LP',
  //   tokenSymbol: 'CHILLv2',
  //   icon: '🍠',
  // },
  // {
  //   pid: 17,
  //   lpAddresses: {
  //     42: '0x3da1313ae46132a397d90d95b1424a9a7e3e0fce',
  //   },
  //   tokenAddresses: {
  //     42: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  //   },
  //   name: 'CRV Crocodile',
  //   symbol: 'CRV-ETH UNI-V2 LP',
  //   tokenSymbol: 'CRV',
  //   icon: '🐊',
  // },
]
