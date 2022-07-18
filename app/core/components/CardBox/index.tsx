import React from "react"
import { CardBoxStyle } from "./CardBox.styles"

interface IProps {
  children: React.ReactNode
  title?: string
  className?: string
  titleClassName?: string
  bodyClassName?: string
}

export const CardBox = ({ children, title, className, titleClassName, bodyClassName }: IProps) => {
  return (
    <CardBoxStyle className={className != null ? className : ""}>
      {title != null && (
        <div className={`CardBox--title ${titleClassName != null ? titleClassName : ""}`}>
          {title}
        </div>
      )}
      <div className={`CardBox--content ${bodyClassName != null ? bodyClassName : ""}`}>
        {children}
      </div>
    </CardBoxStyle>
  )
}

export default CardBox
