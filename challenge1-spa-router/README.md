# React와 History API 사용하여 SPA Router 기능 구현하기

- [과제 설명](#과제-설명)
- [과제 구현](#과제-구현)

## 과제 설명
**1) 해당 주소로 진입했을 때 아래 주소에 맞는 페이지가 렌더링 되어야 한다.**

- `/` → `root` 페이지
- `/about` → `about` 페이지

**2) 버튼을 클릭하면 해당 페이지로, 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동해야 한다.**

- 힌트) `window.onpopstate`, `window.location.pathname` History API(`pushState`)

**3) Router, Route 컴포넌트를 구현해야 하며, 형태는 아래와 같아야 한다.**

```tsx
ReactDOM.createRoot(container).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```

**4) 최소한의 push 기능을 가진 useRouter Hook을 작성한다.**

```tsx
const { push } = useRouter();
```

**5) 아래 스크린샷을 참고하여 앱을 작성한다.**

- **TO-BE) Root 경로**
    
   ![](https://lean-mahogany-686.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd2a19c69-ed92-4431-afca-156a3d8ccd7e%2FUntitled.png?id=5526a31c-b3c7-4fb8-9b66-cf510264e1ac&table=block&spaceId=7ac0bf59-e3bb-4f76-a93b-27f040ec55b6&width=2000&userId=&cache=v2)
    
- **TO-BE) About 경로**

  ![](https://lean-mahogany-686.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa10c03a3-1d27-4a02-a495-c7f98775ca23%2FUntitled.png?id=c3f5bcfe-e485-467f-8cd8-b97168c25c1d&table=block&spaceId=7ac0bf59-e3bb-4f76-a93b-27f040ec55b6&width=2000&userId=&cache=v2)


## 과제 구현
### RouterContext (src/router/RouterContext.tsx)
```tsx
import { createContext } from "react";

interface RouterContext {
  currentPath: string;
}

const RouterContext = createContext<RouterContext>({ currentPath: "" });

export default RouterContext;
```

Router에서 관리중인 `currentPath`의 정보를 전역적으로 관리하기 위해 React의 `createContext`를 사용하여 `RouterContext`를 생성했습니다.


### Router (src/router/Router.tsx)
```tsx
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
```

현재 페이지 경로 (`currentPath`)를 관리하며 Context API의 `Provider`를 사용해 하위 컴포넌트에서 경로 정보에 접근할 수 있도록 합니다.
window `popstate` 이벤트를 이용해 뒤로가기 버튼을 통한 경로의 변경을 감지하고 다시 반영합니다.


### Route
```tsx
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
```

component와 해당 컴포넌트를 표시할 path를 props로 받습니다.
props로 전해받은 `path`와 RouterContext에서 관리중인 currentPath(현재 경로)의 값이 일치할 때 component를 화면에 표시합니다.


### useRouter
```tsx
import { useCallback } from "react";

const useRouter = () => {
  const push = useCallback((path: string) => {
    window.history.pushState("", "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return { push };
};

export default useRouter;
```

useRouter의 `push` 함수는 이동할 경로 `path`를 인자로 전달받고, History API의 pushState 메서드를 사용해 페이지를 갱신하거나 새로고침하지 않고 해당 `path`로 페이지를 전환합니다.
이 때, RouterContext에서 관리중인 `currentPath`값이 함께 변경되어 화면이 새로 렌더링될 수 있도록 Router가 구독중인 `popstate`이벤트를 생성하고 실행시켜,
`currentPath`에 변경된 경로가 제대로 저장될 수 있도록 합니다.


### About, Root page
```tsx
import useRouter from "../hooks/useRouter";

const About = () => {
  const { push } = useRouter();

  return (
    <>
      <h1>about</h1>
      <button onClick={() => push("/")}>go main</button>
    </>
  );
};

export default About;
```
```tsx
import useRouter from "../hooks/useRouter";

const Root = () => {
  const { push } = useRouter();

  return (
    <>
      <h1>root</h1>
      <button onClick={() => push("/about")}>about</button>
    </>
  );
};

export default Root;
```
