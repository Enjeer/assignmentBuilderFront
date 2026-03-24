// pages/AuthPage.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { signUp, logIn } from "@/features/auth/authSlice";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import googleIcon from '@/assets/images/google.svg';

export default function AuthPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error, user } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if ((user && status === "succeeded") || (user && status === "idle")) {
        navigate("/", { replace: true });
        }
    }, [user, status, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignUp) {
            if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
            }

            setPasswordMismatch(false);

            dispatch(
                signUp({
                    user_name: username,
                    email,
                    password
                })
            );
        } else {
            dispatch(logIn({ login: email, password }));
        }
        };

    const handleSignWithGoogle = () => {
        // dispatch(googleAuth());
    };

    return (
        <section className="auth">
        <h1 className="auth__naming">
            Assignment
            <br />
            Builder
        </h1>

        <form className="auth__form" onSubmit={handleSubmit}>
            <p className="form__action">{isSignUp ? "Sign Up" : "Sign In"}</p>

            {isSignUp && (
                <div className="form__field">
                <label htmlFor="username">Username</label>
                <input
                    className="form__input"
                    id="username"
                    type="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                </div>
            )}

            <div className="form__field">
            <label htmlFor="email">Email</label>
            <input
                className="form__input"
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`Email ${isSignUp? '': 'or username'}`}
                required
            />
            </div>

            <div className="form__field">
            <label htmlFor="password">Password</label>
            <input
                className="form__input"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            </div>

            {isSignUp && (
            <div className="form__field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                className="form__input"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                />
                {passwordMismatch && (
                <p style={{ color: "red" }}>Passwords do not match</p>
                )}
            </div>
            )}

            {status === "loading" && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p
            className="form__switch"
            onClick={() => {
                setIsSignUp(!isSignUp);
                setPasswordMismatch(false);
                setPassword("");
                setConfirmPassword("");
            }}
            style={{ cursor: "pointer" }}
            >
            {isSignUp
                ? "Already have an account? Sign In"
                : "No account? Sign Up"}
            </p>

            <div className="form__buttons-container">
            <button
                className="form__google-auth"
                type="button"
                id="signWithGoogle"
                onClick={handleSignWithGoogle}
            >
                <img src={googleIcon} alt="Google SignIn Icon"/>
                Sign with Google
            </button>
            <button className="form__submit" type="submit">
                {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            </div>
        </form>
        </section>
    );
}