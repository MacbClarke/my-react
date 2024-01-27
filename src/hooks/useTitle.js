import { useState, useEffect } from "../my-react";

export default useTitle = (_t) => {
    const [title, setTitle] = useState(_t);

    useEffect(() => {
        document.title = title;
    }, [title])

    return [title, setTitle];
}
