import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import Home from "./pages/Home";
import OctoProfiles from "./pages/OctoProfiles";
import CookiesCounter from "./pages/CookiesCounter";

export default function App() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-background">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/octo-profiles" element={<OctoProfiles />} />
                    <Route path="/cookies-counter" element={<CookiesCounter />} />
                </Routes>
            </main>
        </div>
    );
}
