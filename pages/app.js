import { MyReact } from "../my-react"

const useTitle = (_t) => {
    const [title, setTitle] = MyReact.useState(_t);

    MyReact.useEffect(() => {
        document.title = title;
    }, [title])

    return [title, setTitle];
}

export const App = () => {
    const [count1, setCount1] = MyReact.useState(0);
    const [count2, setCount2] = MyReact.useState(0);
    const [input, setInput] = MyReact.useState('');
    const [, setTitle] = useTitle('hi')

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
            <h1>{input}</h1>
            <input value={input} onInput={handleInput} />
        </div>
    );
}