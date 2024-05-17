import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./containers/Home.tsx";
import BowlingBooking from "./containers/BowlingBooking.tsx";
import NavBar from "./components/NavBar.tsx";


function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bowling" element={<BowlingBooking />} />
                {/*TODO: add routes to airhockey, dinnerbooking, login etc.*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;