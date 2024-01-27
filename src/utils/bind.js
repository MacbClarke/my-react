export default bind = (_v, setValue) => {
    const handleInput = (e) => {
        setValue(e.target.value);
    };

    return {
        value: _v,
        onInput: handleInput,
    };
};