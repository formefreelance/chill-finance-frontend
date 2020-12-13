import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x4ad97fd79f8a2ae0e5415821bc06781bf5a164e1#code"
      >
        MasterMew Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://info.uniswap.org/pair/0xddBDfb8FAc34863fd97e6ff52B95cF257C3c2721"
      >
        Uniswap CHILL-ETH
      </StyledLink>
      <StyledLink target="_blank" href="https://chillswap.medium.com/chill-finance-aka-chillswap-2c2505be1727">
        Medium
      </StyledLink>
      <StyledLink target="_blank" href="https://www.youtube.com/watch?v=hohy1XGyk6I">
        Mew
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

export default Nav
