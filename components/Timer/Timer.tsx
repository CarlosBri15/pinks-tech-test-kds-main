import { useEffect, useState } from "react";
import s from "./Timer.module.scss";

export default function Timer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(Date.now() - startTime);

    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const seconds = Math.floor(elapsed / 1000);
  const m = Math.floor(seconds / 60);
  const sDisplay = (seconds % 60).toString().padStart(2, "0");

  const isWarning = seconds > 60;
  const isCritical = seconds > 120;

  let statusClass = s.normal;
  if (isCritical) statusClass = s.critical;
  else if (isWarning) statusClass = s.warning;

  return (
    <div className={`${s.timer} ${statusClass}`}>
      ⏱ {m}:{sDisplay}
    </div>
  );
}
