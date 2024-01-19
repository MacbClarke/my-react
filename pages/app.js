import { MyReact } from "../my-react"

export const App = () => {
    const [count1, setCount1] = MyReact.useState(0);
    const [count2, setCount2] = MyReact.useState(0);
    const [input, setInput] = MyReact.useState('');

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    return (
        <div>
            <h1>{count1}</h1>
            <button onClick={() => setCount1(count1 + 1)}>click</button>
            <h1>{count2}</h1>
            <button onClick={() => setCount2(count2 + 1)}>click</button>
            <h1>{input}</h1>
            <input value={input} onInput={handleInput} />
        </div>
    );
}