import { memo } from "react";
import {
  OverlayWrapper,
  OverlayContent,
  OverlayMessage,
  OverlayShadow,
} from "./Overlay.styles";
import Button from "components/Button";

type OverlayPropTypes = {
  message?: string;
  onBtnClick?: () => void;
  buttonText?: string;
};
export const Overlay = memo(
  ({ message, onBtnClick, buttonText }: OverlayPropTypes) => (
    <OverlayWrapper>
      <OverlayShadow />
      <OverlayContent>
        <OverlayMessage>{message}</OverlayMessage>
        {onBtnClick && (
          <Button onClick={onBtnClick} name={buttonText || "Reconnect"} />
        )}
      </OverlayContent>
    </OverlayWrapper>
  )
);
