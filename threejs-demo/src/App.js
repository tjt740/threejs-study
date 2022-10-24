import { BrowserRouter } from 'react-router-dom';
import { RouterCom } from './router/router.jsx';
function App() {
    return (
        <>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <RouterCom/>
            </BrowserRouter>
        </>
    );
}

export default App;
