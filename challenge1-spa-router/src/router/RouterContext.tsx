import { createContext } from "react";

interface RouterContext {
  currentPath: string;
}

const RouterContext = createContext<RouterContext>({ currentPath: "" });

export default RouterContext;
