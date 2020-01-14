import React, { useContext } from "react";
import useAxios from "./useAxios";
import GlobalConfigComp from "./globalConfig";

const Index = props => {
  const [status, refetch] = useAxios(
    {
      method: "GET",
      url: "http://api.linbudu.top/data"
    },
    // 是否初始化时触发
    { trigger: false }
  );
  console.log(status);
  const { error, data, loading } = status;
  if (error) {
    return <p>err!{JSON.stringify(error)}</p>;
  }
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>useAxios,{data ? data.data.data.length : null}</p>
      )}
      <button
        onClick={() => {
          refetch();
        }}
      >
        fetch
      </button>
    </>
  );
};

const App = () => {
  return (
    <GlobalConfigComp
      config={{ baseURL: "http://api.linbudu.top", method: "GET" }}
    >
      <Index />
    </GlobalConfigComp>
  );
};
export default App;
