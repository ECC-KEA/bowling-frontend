import {SignIn} from "@clerk/clerk-react";

function Login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignIn fallbackRedirectUrl={"/inventory"} />
        </div>
    );
}

export default Login;
