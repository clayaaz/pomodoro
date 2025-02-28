import React, { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import TimerIcon from "@mui/icons-material/Timer";
import SnoozeIcon from "@mui/icons-material/Snooze";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function MyTimer({ expiryTimestamp }) {
  const [isBreak, setIsBreak] = useState(false);
  const [breakCount, setBreakCount] = useState(0);
  const [bigBreak, setBigBreak] = useState(false);

  const sendNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message);
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (!isBreak && breakCount === 3) {
        setIsBreak(true);
        setBigBreak(true);
        setBreakCount(0);
        sendNotification("Time for a big break!");
        const time = new Date();
        time.setSeconds(time.getSeconds() + 1800);
        restart(time);
      } else if (!isBreak) {
        setBigBreak(false);
        setIsBreak(true);
        setBreakCount((prev) => prev + 1);
        sendNotification("Time for a short break!");
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        restart(time);
      } else {
        setBigBreak(false);
        setIsBreak(false);
        sendNotification("Back to work!");
        const time = new Date();
        time.setSeconds(time.getSeconds() + 1500);
        restart(time);
      }
    },
    autoStart: false,
  });

  return (
    <div className="w-96 p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg text-white text-center">
      <h1 className="text-3xl font-bold">Pomodoro</h1>
      <div className="text-6xl my-4">
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div className="text-lg">
        <p>{isRunning ? "Running" : "Not running"}</p>
        <p>{isBreak ? "Break" : "Work"}</p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button className="p-2 hover:scale-110 transition" onClick={resume}><TimerIcon fontSize="large" /></button>
        <button className="p-2 hover:scale-110 transition" onClick={pause}><SnoozeIcon fontSize="large" /></button>
        <button className="p-2 hover:scale-110 transition" onClick={() => {
            const time = new Date();
            time.setSeconds(time.getSeconds() + (bigBreak ? 1800 : isBreak ? 300 : 1500));
            restart(time);
          }}>
          <RestartAltIcon fontSize="large"/>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 1500);
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://preview.redd.it/1r1kk9qi00961.png?auto=webp&s=83cf540b3dc700af50780debc8a74aa12940949b')" }}>
      <MyTimer expiryTimestamp={time} />
    </div>
  );
}
