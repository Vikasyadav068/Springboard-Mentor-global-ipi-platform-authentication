import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkIfEmailExists = async (email) => {
    try {
      // Try to sign in with a dummy password to check if email exists
      await signInWithEmailAndPassword(auth, email, "dummy-password-to-check-email");
      return true;
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/too-many-requests") {
        // Email exists but password is wrong - this means the email is registered
        return true;
      } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        // Email doesn't exist
        return false;
      }
      // For other errors, assume email might exist
      return true;
    }
  };

  const showToast = (message, type = 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 350px;
      word-wrap: break-word;
    `;
    
    if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a6f)';
    } else if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #51cf66, #40c057)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // First check if email exists
      const emailExists = await checkIfEmailExists(email);
      
      if (!emailExists) {
        const errorMsg = "This email is not registered. Please check your email or create a new account.";
        setError(errorMsg);
        showToast("Email not registered!", "error");
        setLoading(false);
        return;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully! Please check your inbox and spam folder.");
      showToast("Reset link sent to your email!", "success");
      setEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      
      if (err.code === "auth/user-not-found") {
        const errorMsg = "This email is not registered. Please check your email or create a new account.";
        setError(errorMsg);
        showToast("Email not registered!", "error");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
        showToast("Invalid email format!", "error");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a moment before trying again.");
        showToast("Too many attempts. Wait before trying again!", "error");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection and try again.");
        showToast("Network error. Check your connection!", "error");
      } else {
        setError("Failed to send reset email. Please try again later.");
        showToast("Failed to send reset email!", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>

      <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#666" }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="form-group">
        <input
          type="email"
          className="form-input"
          placeholder="Enter your registered email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="email"
          autoFocus
        />
      </div>

      <button className="btn-primary" onClick={handleReset} disabled={loading}>
        {loading ? "Sending Reset Email..." : "Send Reset Link"}
      </button>

      <div className="auth-links">
        <p>
          Remember your password? <Link to="/">Back to Sign In</Link>
        </p>
        <p>
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', fontSize: '14px', color: '#555' }}>
        <strong>📧 Email Reset Instructions:</strong>
        <ul style={{ marginTop: '0.5rem', marginBottom: '0', paddingLeft: '1.2rem' }}>
          <li>Check your spam/junk folder if you don't see the email</li>
          <li>The reset link will expire in 1 hour</li>
          <li>You can only request a reset email every few minutes</li>
          <li>Make sure you entered the correct email address</li>
          <li>If you don't receive the email, the address might not be registered</li>
        </ul>
      </div>
      
      {/* Test button for debugging - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button 
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            onClick={() => {
              console.log('Firebase Auth instance:', auth);
              console.log('Current user:', auth.currentUser);
              showToast('Test toast notification!', 'success');
            }}
          >
            🔧 Debug Info
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
