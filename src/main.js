import { MyReact, MyReactDom } from "./my-react/my-react";
import { App } from "./pages/app";

MyReactDom.render(
    <App/>,
    document.getElementById('root')
);