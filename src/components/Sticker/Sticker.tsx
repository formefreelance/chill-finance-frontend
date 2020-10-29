import React from 'react'
import styled from 'styled-components'

interface StickerProps {
  children?: React.ReactNode,
}

const Sticker: React.FC<StickerProps> = ({ children }) => (
  <StyledCardIcon>
    {children}
  </StyledCardIcon>
)

const StyledCardIcon = styled.div`
  color: ${(props) => props.theme.color.grey[600]};
  background-color: ${props => props.theme.color.grey[200]};
  height: 40px;
  width: 40px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
    inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  margin: 0 auto ${props => props.theme.spacing[3]}px;
  font-size: 12px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
`

export default Sticker