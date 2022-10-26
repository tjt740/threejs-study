import PackagePreview3D from '../装箱demo';
import Demo1Component from '../lessons/day1';
import { Route, Routes } from 'react-router-dom';
export function RouterCom() {
    return (
        <Routes>
            <Route path="/demo" exact={false} element={<Demo1Component />} />
            <Route
                path="/package-preview"
                exact={false}
                element={<PackagePreview3D />}
            />
        </Routes>
    );
}
