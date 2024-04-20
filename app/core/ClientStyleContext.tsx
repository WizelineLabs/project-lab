import * as React from "react";

export interface ClientStyleContextData {
  reset: () => void;
}

export default React.createContext<ClientStyleContextData>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => {},
});
