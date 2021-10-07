import { useEffect } from "react";
import { useTabBlurFocus } from "./Hooks";
import { WebSockets } from "./WebSocket/WebSockets";

function App() {
  // const [state, setState] = useState({});
  // const func = (arg: Arg) => {
  //   if (arg.name === "CLS") console.log(arg);
  //   else console.log(arg);
  // };
  const tabState = useTabBlurFocus();
  useEffect(() => {
    // console.log(tabState);
  }, [tabState]);
  // reportWebVitals(func);
  return <WebSockets />;
}

export default App;
