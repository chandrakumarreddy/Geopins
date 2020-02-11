import { createContext } from "react";

const context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: []
});

context.displayName = "UserContext";

export default context;
