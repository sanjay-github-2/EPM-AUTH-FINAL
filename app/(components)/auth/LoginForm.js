"use client";

import React, { useEffect, useState } from "react";

import ForgotPasswordForm from "./ResetPassword";
import GithubButton from "./signinbtns/GithubSignin";
import GoogleButton from "./signinbtns/GoggleSignin";
import Link from "next/link";
import Loader from "../loader/loader";
import Microsoft from "./signinbtns/MicrosoftSignin";
import ReactCardFlip from "react-card-flip";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TextField, IconButton } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  });

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(errorTimeout);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        remember: rememberMe ? "1" : undefined,
      });

      if (!result.error) {
        router.push("/dashboard");
        toast.success("Login success");
      } else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function flipcard() {
    setIsFlipped(!isFlipped);
  }

  const handleBackButton = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <>
      <ReactCardFlip
        flipDirection="vertical"
        isFlipped={isFlipped}
        className="flex align-middle justify-center "
        handleBackButton={handleBackButton}
      >
        <div className="md:w-80 h-full  bg-white p-8 pt-2 rounded shadow-md flex flex-col ">
          {loading && <Loader />}{" "}
          <form onSubmit={handleSubmit}>
            <h1 className="text-xl font-bold mb-4">Sign In</h1>{" "}
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full "
                size="small"
              />

              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      className="focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  ),
                }}
              />
            </div>
            <div className="mb-4 flex justify-between mt-2">
              <div>
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 border-lime-400 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-sm">
                  Remember Me
                </label>
              </div>
              <div className="mr-2">
                <Link
                  href="#"
                  className="text-blue-500 hover:underline"
                  onClick={flipcard}
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline self-end"
              type="submit"
            >
              Login
            </button>
            <span className="flex items-center pt-5 pb-5">
              <span className="h-px flex-1 bg-black"></span>
              <span className="shrink-0 px-6">or</span>
              <span className="h-px flex-1 bg-black"></span>
            </span>
          </form>
          <div className="flex flex-row  justify-between mx-10 mb-2">
            <GoogleButton />
            <GithubButton />
            <Microsoft />
          </div>
          <p className="mt-3">
            Don{"'"}t have an account?{" "}
            <strong>
              <Link
                className="text-blue-700 hover:text-blue-800 hover:underline"
                href="/Register"
              >
                Sign up{" "}
              </Link>
            </strong>{" "}
          </p>
          {error && (
            <div className=" bg-red-500 text-white px-3 py-1 mt-2 rounded-md">
              {error}
            </div>
          )}
        </div>

        <div>
          <ForgotPasswordForm
            setIsFlipped={setIsFlipped}
            isFlipped={isFlipped}
          />
        </div>
      </ReactCardFlip>
    </>
  );
};

export default LoginForm;
