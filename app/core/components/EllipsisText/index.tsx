import { TitleText } from "./EllipsisText.styles";
import type { PropsWithoutRef } from "react";

interface IProps {
  text: string;
  length: number;
  tail?: string;
  tailClassName?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["span"]>;
}

export const EllipsisText = ({
  text,
  length,
  tail = "...",
  tailClassName = "more",
  outerProps,
}: IProps) => {
  if (text.length <= length || length < 0) {
    return <p {...outerProps}>{text}</p>;
  } else {
    const tailStyle = {
      cursor: "auto",
    };

    let displayText;
    if (length - tail.length <= 0) {
      displayText = "";
    } else {
      displayText = text.slice(0, length - tail.length);
    }

    return (
      <TitleText title={text} {...outerProps}>
        {displayText}
        <span style={tailStyle} className={tailClassName}>
          {tail}
        </span>
      </TitleText>
    );
  }
};

export default EllipsisText;
