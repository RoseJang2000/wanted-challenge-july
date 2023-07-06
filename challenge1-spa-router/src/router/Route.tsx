import { useContext } from "react";
import RouterContext from "./RouterContext";

interface RouteProps {
  path: string;
  component: React.ReactNode;
}

const Route = ({ path, component }: RouteProps) => {
  const { currentPath } = useContext(RouterContext);

  return currentPath === path ? component : null;
};

export default Route;
