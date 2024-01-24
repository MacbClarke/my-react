import { MyReact } from "../my-react/my-react"

const useTitle = (_t) => {
    const [title, setTitle] = MyReact.useState(_t);

    MyReact.useEffect(() => {
        document.title = title;
    }, [title])

    return [title, setTitle];
}

const useTimer = (initTime = 0) => {
    const [time, setTime] = MyReact.useState(initTime);
    const timerHandle = MyReact.useRef(undefined);
  
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

export const App = () => {
    const [count1, setCount1] = MyReact.useState(0);
    const [count2, setCount2] = MyReact.useState(0);
    const [input, setInput] = MyReact.useState('');
    const [, setTitle] = useTitle('hi')
    const [time, start, stop, reset] = useTimer(0);

    MyReact.useEffect(() => {
        console.log('rerendered');
    })

    MyReact.useEffect(() => {
        console.log('trigger');
    }, [count2])

    MyReact.useEffect(() => {
        setTitle(input);
    }, [input])

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    const handleSuperClick = () => {
        setCount1(count1 + 1)
        setCount2(count2 + 1)
    }

    return (
        <div>
            <h1 style={{color: count1 & 1 ? "red" : "black"}}>{count1}</h1>
            <button onClick={() => setCount1(count1 + 1)}>click</button>
            <h1>{count2}</h1>
            <button onClick={() => setCount2(count2 + 1)}>click</button>
            <button onClick={handleSuperClick}>super click</button>
            <h1>{time}</h1>
            <button onClick={start}>start</button>
            <button onClick={stop}>stop</button>
            <button onClick={reset}>reset</button>
            <h1>{input}</h1>
            <input value={input} onInput={handleInput} />
        </div>
    );
}