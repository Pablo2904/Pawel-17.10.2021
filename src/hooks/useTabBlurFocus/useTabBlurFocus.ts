import { useState, useEffect, useCallback } from "react";

export enum TabState {
  BLUR = "BLUR",
  FOCUS = "FOCUS",
}

export const useTabBlurFocus = () => {
  const isInitialHidden = document.hidden ? TabState.BLUR : TabState.FOCUS;
  const [tabState, setTabState] = useState<TabState>(isInitialHidden);

  const onBlur = useCallback(() => {
    setTabState(TabState.BLUR);
  }, []);
  const onFocus = useCallback(() => {
    setTabState(TabState.FOCUS);
  }, []);

  useEffect(() => {
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [onBlur, onFocus]);
  return tabState;
};
