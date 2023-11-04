'use client';


import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { useState } from "react";
export default function RetrievalPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- change this
    const [error, setError] = useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = {"username": username, "password": password}
        
        const response = await fetch("/api/retrieval/admin", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data),
          });

          const json = await response.json();

          if (json.success) {
            setIsLoggedIn(true);
      
          } else {
            setIsLoggedIn(false);
            setError('Invalid username or password')
          }

    };

    return (
        isLoggedIn ? (
          <div className="bg-fs-dark-green">
            <UploadDocumentsForm />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input type="text" className="text-black" value={username} onChange={handleUsernameChange} />
            </label>
            <label>
              Password:
              <input type="password" className="text-black" value={password} onChange={handlePasswordChange} />
            </label>
            {error && <p>{error}</p>}
            <button type="submit">Login</button>
          </form>
        )
      );
}