import React from 'react'
import styled, { keyframes } from 'styled-components'

import CardIcon from '../CardIcon'
import logo from "../../assets/img/cat5-c.png" 
interface LoaderProps {
  text?: string
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <StyledLoader>
      <CardIcon>
        <StyledChill><img src={logo} style={{ marginTop: -4, width: "120px", height: "100px" }}/></StyledChill>
      </CardIcon>
      {!!text && <StyledText>{text}</StyledText>}
    </StyledLoader>
  )
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const StyledLoader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledChill = styled.div`
  font-size: 32px;
  position: relative;
  animation: 1s ${spin} infinite;
`

const StyledText = styled.div`
  color: ${(props) => props.theme.color.grey[400]};
`

export default Loader
