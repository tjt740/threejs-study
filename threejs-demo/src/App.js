import Demo1Component from './lessons/day1/index.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/demo"  exact={false} element={<Demo1Component />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
