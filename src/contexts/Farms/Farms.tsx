import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useChill from '../../hooks/useChill'

import { bnToDec } from '../../utils'
import { getMasterChefContract, getEarned } from '../../chill/utils'
import { getFarms } from '../../chill/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const chill = useChill()
  const { account } = useWallet()

  const farms = getFarms(chill)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
