import { MyReact, useEffect, useRef, useState } from "../my-react"
import bind from "../utils/bind";

const generateRandomString = (length) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }

  return result;
}

export const App = () => {
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    console.log('render')
  })

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  const handleAdd = () => {
    const _cache = [...list, {
      id: generateRandomString(8),
      name,
    }]
    setName('');
    setList(_cache);
    inputRef.current.focus();
  }

  const handleRemove = (id) => {
    const _list = list.filter(item => item.id !== id);
    setList(_list);
    inputRef.current.focus();
  }

  return (
    <div>
      {list.map(item => (<div key={item.id}>{item.name} <span onClick={() => handleRemove(item.id)}>remove</span></div>))}
      <div>preview: {name}</div>
      <input ref={inputRef} {...bind(name, setName)} />
      <button onClick={handleAdd}>add</button>
    </div>
  );
}