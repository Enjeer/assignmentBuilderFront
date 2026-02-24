// pages/AuthPage.tsx
import React, { useState } from "react"

export default function AuthPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        // упрощённо — в реальном проекте через Redux + API
        if (username && password) {
        localStorage.setItem("token", "dummy-token")
        window.location.href = "/" // после логина редирект на Dashboard
        }
    }

    return (
        <div style={{ padding: 40 }}>
        <h1>Login</h1>
        <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        </div>
    )
}