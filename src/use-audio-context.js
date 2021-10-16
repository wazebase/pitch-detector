import { useRef, useEffect } from "react";
export default function useAudioContext() {
  const audio = useRef();
  useEffect(() => {
    audio.current = new (AudioContext || webkitAudioContext)();
  }, []);
  return audio;
}
