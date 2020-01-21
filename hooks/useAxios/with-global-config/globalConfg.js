import React, { useEffect, useRef } from "react";
import axios from "axios";

export const AxiosContext = React.createContext({});
const GlobalConfig = props => {
  const { config } = props;
  const axiosInstanceRef = useRef();

  useEffect(() => {
    if (config) {
      axiosInstanceRef.current = axios.create(config);
    } else {
      // 如果没有传入则创建一个空的实例
      axiosInstanceRef.current = axios.create();
    }
  }, [config]);
  return (
    <AxiosContext.Provider
      value={{
        axiosInstance: axiosInstanceRef.current
      }}
    >
      {props.children}
    </AxiosContext.Provider>
  );
};
export default GlobalConfig;
