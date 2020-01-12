// App.js
import React from "react";
import useCountDown from "./app";

const Index = () => {
  const [disabled, setDisabled, count] = useCountDown(3, 0);
  return (
    <>
      {!disabled ? (
        <button
          onClick={() => {
            setDisabled(true);
          }}
        >
          send verify code
        </button>
      ) : (
        <button>send again ({count})</button>
      )}
    </>
  );
};
export default Index;
