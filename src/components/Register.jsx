import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please use a different email or login.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Google registration failed. Please try again.");
      console.error("Google registration error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            type="email"
            className="form-input with-icon"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="email"
          />
        </div>
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            className="form-input with-icon"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">🔐</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-input with-icon"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      
      <button 
        className="btn-primary" 
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
      
      <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666' }}>
        <span>or</span>
      </div>
      
      <button 
        className="btn-google" 
        onClick={handleGoogleRegister}
        disabled={loading}
      >
        🌐 Sign up with Google
      </button>
      
      <div className="auth-links">
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
