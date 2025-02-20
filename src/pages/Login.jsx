import { useState } from "react";
import { useNavigate } from "react-router-dom"; // If using React Router
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Used for redirecting after login

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        // Mock authentication
        if (email === "user@example.com" && password === "password123") {
            alert("Login successful!");
            navigate("/dashboard"); // Redirect to dashboard or homepage
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome Back</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                />
                <button type="submit" className="submit-btn">Log In</button>
            </form>
        </div>
    );
};

export default Login;
