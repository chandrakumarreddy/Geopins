import { createContext } from "react";

const context = createContext({
  currentUser: null
});

context.displayName = "UserContext";

export default context;
