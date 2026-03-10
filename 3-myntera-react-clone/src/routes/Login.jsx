import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../store/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(userActions.loginUser(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert("Backend route nahi mila (404)! Pehle backend update karein.");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Server band hai ya connect nahi ho raha.");
  }
};

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="mb-4 text-center">Login</h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <button className="btn btn-danger w-100 py-2">CONTINUE</button>
        </form>
      </div>
    </main>
  );
};

export default Login;