import { useState } from "react";

export default function usePointor() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  function handleMouseMove(event) {
    setPosition({
      x: event.clientX,
      y: event.clientY
    });
  }
  return {
    position,
    handleMouseMove
  };
}
