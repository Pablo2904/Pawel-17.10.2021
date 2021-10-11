import { memo } from "react";
import {
  OverlayWrapper,
  OverlayContent,
  OverlayMessage,
  OverlayShadow,
} from "./Overlay.styles";
import Button from "../Button";

type OverlayPropTypes = {
  message?: string;
  onBtnClick?: () => void;
};
export const Overlay = memo(({ message, onBtnClick }: OverlayPropTypes) => (
  <OverlayWrapper>
    <OverlayShadow />
    <OverlayContent>
      <OverlayMessage>{message}</OverlayMessage>
      {onBtnClick && <Button onClick={onBtnClick} name="Reconnect" />}
    </OverlayContent>
  </OverlayWrapper>
));
