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
