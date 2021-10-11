import { memo } from "react";
import { StyledButton } from "./Button.styles";

type ButtonPropType = {
  name: string;
  onClick: () => void;
};
export const Button = memo(({ name, onClick }: ButtonPropType) => (
  <StyledButton onClick={onClick}>{name}</StyledButton>
));
