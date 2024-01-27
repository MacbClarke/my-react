import { useRef, useState } from "../my-react";

export default useTimer = (initTime = 0) => {
    const [time, setTime] = useState(initTime);
    const timerHandle = useRef(undefined);

    const start = () => {
        timerHandle.current = setInterval(() => {
            setTime((time) => time + 1);
        }, 1000);
    };

    const stop = () => {
        clearInterval(timerHandle.current);
        timerHandle.current = undefined;
    };

    const reset = () => {
        setTime(initTime);
        const shouldRestart = !!timerHandle.current;
        stop();
        if (shouldRestart) {
            start();
        }
    };

    return [time, start, stop, reset];
};