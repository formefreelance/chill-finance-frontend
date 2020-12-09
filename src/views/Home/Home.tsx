import React from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/chillicon.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'
import Burned from './components/Burned'

const Home: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon={<img src={logo} style={{ margin: "-60px 0px 0px -116px", width: "400px", height: "400px"}} />}
        title="MasterMew is Ready"
        subtitle="Stake Uniswap LP tokens to claim your CHILL!"
      />

      <Container>
        <Balances />
        <Spacer/>
        <Burned />
      </Container>
      <Spacer size="lg" />
      <StyledInfo>
        🏆<b>Pro Tip</b>: CHILL-ETH UNI-V2 LP token pool yields 3x more token
        rewards per block.
      </StyledInfo>
      <Spacer size="lg" />
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <Button text="Go to Category" to="/farms" variant="secondary" />
      </div>
    </Page>
  )
}

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
