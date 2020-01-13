const Index = () => {
  const [status, refetch] = useAxios(
    {
      method: "GET",
      url: "http://api.linbudu.top/data"
    },
    // 是否初始化时触发，为false则需要手动调用
    { trigger: false }
  );
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

export default Index;
