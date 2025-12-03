import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Replace history to prevent back navigation to dashboard after logout
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to Dashboard</h2>
      
      {user && (
        <>
          <div className="user-info">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Account Information</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid.substring(0, 8)}...</p>
            <p><strong>Account Created:</strong> {formatDate(user.metadata?.creationTime)}</p>
            <p><strong>Last Sign In:</strong> {formatDate(user.metadata?.lastSignInTime)}</p>
            <p><strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}</p>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
              You have successfully logged in..
            </p>
          </div>
          
          <button
            className="btn-logout"
            onClick={handleLogout}
          >
            🚪 Sign Out
          </button>
        </>
      )}
    </div>
  );
}

export default Dashboard;
