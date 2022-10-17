import Demo1Component from './lessons/day1/index.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ThreeComponent from './装箱demo';
function App() {
    return (
        <>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                111
                <Routes>
                    <Route path="/demo"  exact={false} element={<Demo1Component />} />
                    <Route path="/three"  exact={false} element={<ThreeComponent />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
