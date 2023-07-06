import { useEffect, useState } from "react";
import RouterContext from "./RouterContext";

interface RouterProps {
  children: React.ReactNode;
}

const Router = ({ children }: RouterProps) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.addEventListener("popstate", handleLocationChange);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath }}>
      {children}
    </RouterContext.Provider>
  );
};

export default Router;
