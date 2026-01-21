import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaEdit, FaSignOutAlt, FaSearch, FaTrash, FaCheckCircle } from "react-icons/fa";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("messages");
  const [aboutText, setAboutText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState("idle"); 

  const authToken = localStorage.getItem("authToken");

  // Check Auth & Fetch Data
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    setLoading(true);

    const fetchContent = async () => {
        const headers = { 'Authorization': `Bearer ${authToken}` };
        try {
            const contentRes = await fetch('https://my-portfolio-26o8.onrender.com/api/content');
            const contentData = await contentRes.json();
            const about = contentData.find(item => item.section_name === 'about_text');
            if (about) setAboutText(about.content);
        } catch (e) {
            console.error("Failed to fetch public content:", e);
        }

        // 2. Fetch Messages (Protected Endpoint)
        try {
            const msgRes = await fetch('https://my-portfolio-26o8.onrender.com/api/messages', { headers });
            if (msgRes.status === 401) { 
                localStorage.removeItem("authToken"); 
                navigate("/login");
                return;
            }
            const msgData = await msgRes.json();
            setMessages(Array.isArray(msgData) ? msgData : []);
        } catch (e) {
            console.error("Failed to fetch protected messages:", e);
        } finally {
            setLoading(false);
        }
    };
    fetchContent();
  }, [navigate, authToken]);

  const handleUpdateContent = async () => {
    setUpdateStatus("saving");
    try {
        const response = await fetch('https://my-portfolio-26o8.onrender.com/api/content/update', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ section: 'about_text', content: aboutText })
        });

        if (response.ok) {
            setUpdateStatus("saved");
            setTimeout(() => setUpdateStatus("idle"), 2000);
        } else {
            console.error("Update failed:", await response.json());
            setUpdateStatus("idle");
            alert("Failed to save content.");
        }
    } catch (e) {
        console.error("Network error during update:", e);
        setUpdateStatus("idle");
        alert("Server connection failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  
  const deleteMessage = (id) => {
    if(window.confirm("Delete this message? (Requires backend implementation)")) {
        setMessages(messages.filter(msg => msg.id !== id));
    }
  };

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center text-primary text-xl bg-bg-dark">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-light flex font-sans selection:bg-primary selection:text-white">
      
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-card-bg border-r border-border-color flex flex-col fixed h-full transition-all duration-300">
        <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-white/5 h-20">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold">R</div>
            <span className="text-xl font-bold hidden md:block">Admin<span className="text-primary">.</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab("messages")} 
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === "messages" ? "bg-primary text-white" : "text-text-dark hover:bg-white/5 hover:text-text-light"}`}
            >
                <FaEnvelope size={20} /> <span className="hidden md:block">Inbox</span>
                {messages.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full hidden md:block">{messages.length}</span>}
            </button>
            <button 
                onClick={() => setActiveTab("content")} 
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === "content" ? "bg-primary text-white" : "text-text-dark hover:bg-white/5 hover:text-text-light"}`}
            >
                <FaEdit size={20} /> <span className="hidden md:block">Edit Content</span>
            </button>
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                <FaSignOutAlt size={20} /> <span className="hidden md:block">Logout</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-20 md:ml-64 p-6 md:p-10 overflow-y-auto h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white capitalize">{activeTab}</h1>
                <p className="text-text-dark text-sm mt-1">Manage your {activeTab} here.</p>
            </div>
            <div className="hidden md:flex items-center bg-card-bg border border-border-color rounded-full px-4 py-2 w-64">
                <FaSearch className="text-text-dark" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm ml-3 text-white w-full" />
            </div>
        </div>

        {/* TAB: MESSAGES */}
        {activeTab === "messages" && (
          <div className="grid gap-4">
            {messages.map((msg) => (
                <div key={msg.id} className="group bg-card-bg border border-border-color hover:border-primary/50 p-6 rounded-xl transition-all duration-300 relative">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                {msg.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{msg.name}</h3>
                                <p className="text-sm text-primary">{msg.email}</p>
                            </div>
                        </div>
                        <span className="text-xs text-text-dark mt-2 md:mt-0">{msg.created_at ? new Date(msg.created_at).toDateString() : 'Date N/A'}</span>
                    </div>
                    <p className="text-text-light bg-bg-dark/50 p-4 rounded-lg border border-white/5">
                        {msg.message}
                    </p>
                    
                    <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="absolute top-6 right-6 text-text-dark hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                        title="Delete Message"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
            {messages.length === 0 && (
                <div className="text-center py-20 text-text-dark">
                    <p className="text-xl">All caught up! No new messages.</p>
                </div>
            )}
          </div>
        )}

        {/* TAB: EDIT CONTENT */}
        {activeTab === "content" && (
          <div className="max-w-3xl">
            <div className="bg-card-bg border border-border-color p-8 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">About Me Section</h3>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text-dark mb-2">Bio Description</label>
                    <textarea 
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="w-full h-48 p-4 bg-bg-dark border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text-light leading-relaxed resize-none"
                    />
                    <p className="text-xs text-text-dark mt-2">This text will appear on your homepage.</p>
                </div>

                <div className="flex justify-end items-center gap-4">
                    {updateStatus === 'saved' && (
                        <span className="text-green-400 flex items-center gap-2">
                            <FaCheckCircle /> Saved!
                        </span>
                    )}
                    <button 
                        onClick={handleUpdateContent}
                        disabled={updateStatus === 'saving'}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {updateStatus === 'saving' ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;