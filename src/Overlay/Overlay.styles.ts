import styled from "styled-components";
import colors from "../styles";

export const OverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OverlayShadow = styled.span`
  left: 0;
  top: 0;
  position: absolute;
  background-color: ${colors.darkorchid};
  opacity: 0.35;
  width: 100%;
  height: 100%;
`;

export const OverlayContent = styled.div`
  position: relative;
  background: ${colors.blackCharcoal};
  padding: 26px 18px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: fit-content;
`;

export const OverlayMessage = styled.div`
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: bold;
  color: ${colors.milkWhite};
  white-space: pre-line;
`;
