import { memo } from "react";
import { StyledButton } from "./Button.styles";

type ButtonPropsType = {
  name: string;
  onClick: () => void;
  dataTestid?: string;
};
export const Button = memo(({ name, onClick, dataTestid }: ButtonPropsType) => (
  <StyledButton data-testid={dataTestid} onClick={onClick}>
    {name}
  </StyledButton>
));
