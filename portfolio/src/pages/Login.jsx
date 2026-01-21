import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("admin"); 
  const [password, setPassword] = useState("Admin123"); 
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('https://my-portfolio-26o8.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.auth && data.token) {
        localStorage.setItem("authToken", data.token); 
        navigate("/admin");
      } else {
        setError(data.detail || "Login failed. Check username and password.");
      }
    } catch (err) {
      setError("Cannot connect to the backend server (FastAPI).");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark text-text-light relative overflow-hidden">
       {/* Background Gradients */}
       <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>

      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-card-bg border border-border-color rounded-xl backdrop-blur-md shadow-2xl z-10">
        <div className="flex justify-center mb-6 text-primary">
            <FaUserShield size={50} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center text-sm">{error}</div>}
        
        <div className="mb-4">
            <label className="block text-sm text-text-dark mb-2">Username</label>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full p-3 rounded-lg bg-bg-dark border border-border-color focus:ring-2 focus:ring-primary focus:outline-none text-white transition-all"
                placeholder="Enter admin username (e.g., admin)"
                required
            />
        </div>

        <div className="mb-6">
            <label className="block text-sm text-text-dark mb-2">Password</label>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 rounded-lg bg-bg-dark border border-border-color focus:ring-2 focus:ring-primary focus:outline-none text-white transition-all"
                placeholder="Enter password (e.g., Admin123)"
                required
            />
        </div>
        
        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-bold text-white shadow-lg hover:shadow-primary/50 transition-all transform hover:scale-[1.02] disabled:opacity-50"
        >
            {isLoading ? "Authenticating..." : "Unlock Dashboard"}
        </button>
        
        <button type="button" onClick={() => navigate('/')} className="w-full mt-4 text-sm text-text-dark hover:text-text-light">
            Return to Website
        </button>
      </form>
    </div>
  );
};

export default Login;