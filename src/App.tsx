import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./containers/Home";
import BowlingBooking from "./containers/BowlingBooking";
import NavBar from "./components/NavBar";
import {Toaster} from "react-hot-toast";
import AirHockeyBooking from "./containers/AirHockeyBooking";
import DinnerBooking from "./containers/DinnerBooking";
import InventoryItem from "./containers/InventoryItem";
import Login from "./containers/Login";
import {useAuth, useUser} from "@clerk/clerk-react";
import Schedule from "./containers/Schedule.tsx";
import {getOrganization} from "./helpers/authhelpers.ts";


function App() {
    const {isSignedIn} = useAuth();
    const {user} = useUser();
    const organization = getOrganization(user);

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                {!isSignedIn && (
                    <>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<InventoryItem />} />
                        <Route path="/bowling" element={<BowlingBooking />} />
                        <Route path="/airhockey" element={<AirHockeyBooking />} />
                        <Route path="/dinner" element={<DinnerBooking />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/schedule" element={<Schedule />} />
                    </>
                )}
                {isSignedIn && organization === 'operations' && (
                        <>
                            <Route path="/" element={<InventoryItem />} />
                            <Route path="*" element={<InventoryItem />} />
                        </>
                )}
                {isSignedIn && organization === 'management' && (
                    <>
                        <Route path="/" element={<InventoryItem />} />
                        <Route path="*" element={<InventoryItem />} />
                        <Route path="/inventory" element={<InventoryItem />} />
                        <Route path="/schedule" element={<Schedule />} />
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
