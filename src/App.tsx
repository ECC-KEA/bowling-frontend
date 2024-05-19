import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./containers/Home.tsx";
import BowlingBooking from "./containers/BowlingBooking.tsx";
import NavBar from "./components/NavBar.tsx";
import {Toaster} from "react-hot-toast";
import AirHockeyBooking from "./containers/AirHockeyBooking.tsx";
import DinnerBooking from "./containers/DinnerBooking.tsx";


function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bowling" element={<BowlingBooking />} />
                <Route path="/airhockey" element={<AirHockeyBooking />} />
                <Route path="/dinner" element={<DinnerBooking />} />
                
                {/*TODO: add routes to dinnerbooking, login etc.*/}
            </Routes>
            <Toaster
                toastOptions={{
                    position: "bottom-left",
                    style: {
                        padding: "20px",
                        fontSize: "1.2rem"
                    },
                    success: {
                        style: {
                            backgroundColor: "#aaf8b0"
                        }
                    },
                    error: {
                        style: {
                            backgroundColor: "#f8a0a0"
                        }
                    }
                }}
            />
        </BrowserRouter>
    );
}

export default App;