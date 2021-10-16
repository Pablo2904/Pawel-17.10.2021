import { PureComponent } from "react";
import Overlay from "components/Overlay";
import { ErrorBoundaryWrapper } from "./ErrorBoundary.styles";

type Props = {};
type State = { errorMessage?: string };

export default class ErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidCatch({ message }: Error) {
    const errorMessage = `Something went wrong, our experianced team already working on this!
    You can help by sending bellow message to our support team:\n\n${message}`;
    this.setState({ errorMessage });
  }

  render() {
    if (this.state.errorMessage) {
      const onBtnClick = () => window.location.reload();
      return (
        <ErrorBoundaryWrapper>
          <Overlay
            onBtnClick={onBtnClick}
            message={this.state.errorMessage}
            buttonText="Reload page"
          />
          ;
        </ErrorBoundaryWrapper>
      );
    }

    return this.props.children;
  }
}
