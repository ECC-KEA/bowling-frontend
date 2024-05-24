import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./containers/Home";
import BowlingBooking from "./containers/BowlingBooking";
import NavBar from "./components/NavBar";
import {Toaster} from "react-hot-toast";
import AirHockeyBooking from "./containers/AirHockeyBooking";
import DinnerBooking from "./containers/DinnerBooking";
import InventoryItem from "./containers/InventoryItem";
import Login from "./containers/Login";
import {useAuth} from "@clerk/clerk-react";

function App() {
    const {isSignedIn} = useAuth();

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bowling" element={<BowlingBooking />} />
                <Route path="/airhockey" element={<AirHockeyBooking />} />
                <Route path="/dinner" element={<DinnerBooking />} />
                <Route path="/login" element={<Login />} />
                {isSignedIn && (
                    <>
                        <Route path="/inventory" element={<InventoryItem />} />
                        {/* Add other protected routes here */}
                    </>
                )}
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
