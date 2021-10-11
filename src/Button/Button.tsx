import { memo } from "react";
import { StyledButton } from "./Button.styles";

type ButtonPropsType = {
  name: string;
  onClick: () => void;
};
export const Button = memo(({ name, onClick }: ButtonPropsType) => (
  <StyledButton onClick={onClick}>{name}</StyledButton>
));
