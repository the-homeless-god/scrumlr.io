import {useState, useEffect} from "react";
import {Timer as TimerUtils} from "../timer";

interface TimeLeft {
  h: number;
  m: number;
  s: number;
}
/**
 * A hook which calculates the time left based on a provided end Date.
 * Intended for: https://github.com/inovex/scrumlr.io/issues/4217
 * @param timerEnd T
 * @returns The time which is left according to the provided timerEnd
 */
export const useTimer = (timerEnd?: Date) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({h: 0, m: 0, s: 0});
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerEnd === undefined) {
      return;
    }
    const updateTimer = () => {
      const newTimeLeft = TimerUtils.calculateTimeLeft(timerEnd);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.h === 0 && newTimeLeft.m === 0 && newTimeLeft.s === 0) {
        setTimerExpired(true);
      } else {
        timer = setTimeout(updateTimer, 250);
      }
    };
    updateTimer();
    return () => clearTimeout(timer);
  }, [timerEnd]);

  return {timeLeft, timerExpired};
};
