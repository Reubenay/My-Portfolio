import { useState } from "react";

const FormInput = ({ id, label, type = "text", rows, value, onChange }) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-text-dark mb-2"
    >
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        name={id}
        rows={rows || 4}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-md bg-bg-dark border border-border-color focus:ring-2 focus:ring-primary focus:outline-none"
        required
      />
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-md bg-bg-dark border border-border-color focus:ring-2 focus:ring-primary focus:outline-none"
        required
      />
    )}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, sending, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch('https://my-portfolio-26o8.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" }); 
      } else {
        console.error("API Submission Error:", await response.json());
        setStatus("error");
      }
    } catch (error) {
      console.error("Network or connection error:", error);
      setStatus("error");
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "sending":
        return "Sending...";
      case "success":
        return "Message Sent! ";
      case "error":
        return "Failed! Try Again ";
      default:
        return "Send a message";
    }
  };

  return (
    <section id="contact" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-16">Contact</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-card-bg border border-border-color rounded-lg p-8 md:p-12 shadow-xl"
      >
        <FormInput id="name" name="name" label="Name" value={formData.name} onChange={handleChange} />
        <FormInput id="email" name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput id="message" name="message" label="Message" type="textarea" value={formData.message} onChange={handleChange} />

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full px-6 py-3 rounded-md text-lg font-semibold text-white 
                     bg-gradient-to-r from-primary to-secondary 
                     hover:from-secondary hover:to-primary 
                     transition-all duration-300 disabled:opacity-50"
        >
          {getButtonText()}
        </button>
        
        {status === "error" && (
            <p className="text-red-400 text-center mt-4">Could not send message. Check server connection.</p>
        )}

      </form>
    </section>
  );
};

export default Contact;