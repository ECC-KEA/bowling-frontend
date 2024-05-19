import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./containers/Home.tsx";
import BowlingBooking from "./containers/BowlingBooking.tsx";
import NavBar from "./components/NavBar.tsx";
import {Toaster} from "react-hot-toast";
import AirHockeyBooking from "./containers/AirHockeyBooking.tsx";


function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bowling" element={<BowlingBooking />} />
                <Route path="/airhockey" element={<AirHockeyBooking />} />
                {/*TODO: add routes to dinnerbooking, login etc.*/}
            </Routes>
            <Toaster position={"bottom-left"}/>
        </BrowserRouter>
    );
}

export default App;