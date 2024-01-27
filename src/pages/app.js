import { MyReact, useEffect, useState } from "../my-react"
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

  useEffect(() => {
    console.log('render')
  })

  const handleAdd = () => {
    const _cache = [...list, {
      id: generateRandomString(8),
      name,
    }]
    setName('');
    setList(_cache);
  }

  const handleRemove = (id) => {
    const _list = list.filter(item => item.id !== id);
    setList(_list);
  }

  return (
    <div>
      {list.map(item => (<div key={item.id}>{item.name} <span onClick={() => handleRemove(item.id)}>remove</span></div>))}
      <div>preview: {name}</div>
      <input {...bind(name, setName)} />
      <button onClick={handleAdd}>add</button>
    </div>
  );
}