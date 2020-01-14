import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AxiosContext } from "./globalConfig";

export default (config, options, dependencies = []) => {
  const globalConfig = useContext(AxiosContext) || {};

  // FIXME:始终是undefined
  console.log(globalConfig);
  const axiosInstance = globalConfig.axiosInstance || axios.create();

  const [status, setStatus] = useState({
    error: undefined,
    data: undefined,
    loading: false
  });

  const refetch = async overwriteConfig => {
    setStatus({ ...status, loading: true });
    try {
      // 使用实例来请求数据
      const data = await axiosInstance.request({
        ...config,
        overwriteConfig
      });
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
