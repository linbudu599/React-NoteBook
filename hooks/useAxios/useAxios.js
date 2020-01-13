export default (config, options, dependencies = []) => {
  const [status, setStatus] = useState({
    error: undefined,
    data: undefined,
    loading: false
  });

  const refetch = async overwriteConfig => {
    setStatus({ ...status, loading: true });
    try {
      const data = await axios.request({ ...config, overwriteConfig });
      return setStatus({ ...status, data, loading: false });
    } catch (error) {
      return setStatus({ ...status, error, loading: false });
    }
  };
  useEffect(() => {
    // 如果被设置为true，则会在初始化时自动执行
    if (options.trigger) {
      refetch();
    }
  }, dependencies);

  return [status, refetch];
};
