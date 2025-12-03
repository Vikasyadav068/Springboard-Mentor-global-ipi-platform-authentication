import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <input
          type="email"
          className="form-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="email"
        />
      </div>
      
      <div className="form-group">
        <input
          type="password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="current-password"
        />
      </div>
      
      <button 
        className="btn-primary" 
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
      
      <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666' }}>
        <span>or</span>
      </div>
      
      <button 
        className="btn-google" 
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        🌐 Sign in with Google
      </button>
      
      <div className="auth-links">
        <p>
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
