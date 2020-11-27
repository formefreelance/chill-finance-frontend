import React from 'react'
import cat2 from "../../assets/img/cat2.png";
import CardIcon from "../CardIcon";
interface ChillIconProps {
  size?: number
  v1?: boolean
  v2?: boolean
  v3?: boolean
}

const ChillIcon: React.FC<ChillIconProps> = ({ size = 36, v1, v2, v3 }) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? 'saturate(0.5)' : undefined,
    }}
  >
    <CardIcon><img src={cat2} style={{ marginTop: -4, width: "120px", height: "90px" }} /></CardIcon>
  </span>
)

export default ChillIcon
