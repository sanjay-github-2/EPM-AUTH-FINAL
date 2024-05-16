"use client";

import Checkbox from "../common/Checkbox";
import Link from "next/link";
import Loader from "../loader/loader";
import ReactCardFlip from "react-card-flip";
import SSOUser from "./SSOuser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import { encryptData, decryptData } from "../../api/server/utils/Crypto";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { TextField, IconButton } from "@mui/material";

const RegisterForm = () => {
  const router = useRouter();
  const checkboxRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSSOUser, setIsSSOUser] = useState(false);
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(true);
  const [checkbox3, setCheckbox3] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const storeOTP = (otp) => {
    console.log(otp);
    const encryptedOTP = encryptData(otp);

    localStorage.setItem("otp", encryptedOTP);
  };
  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(errorTimeout);
  }, [error]);

  const { data: session, status } = useSession();
  const retrieveOTP = () => {
    const encryptedOTP = localStorage.getItem("otp");
    if (encryptedOTP) {
      const decryptedotp = decryptData(encryptedOTP);
      return decryptedotp;
    }
    return null;
  };

  const handleVerifyEmail = async () => {
    try {
      const responseEmail = await fetch(`/api/checkUserExists?email=${email}`, {
        method: "GET",
      });
      const { emailExists } = await responseEmail.json();

      if (emailExists) {
        throw new Error("Email already exists! ");
      }

      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const otp = responseData.otp;
        storeOTP(otp);
        setOtpSent(true);
        setError("");
      } else {
        throw new Error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);

      setError(error.message || "Error sending OTP. Please try again later.");
    }
  };

  const handleValidateOTP = async () => {
    try {
      const storedEncryptedOTP = retrieveOTP();

      if (storedEncryptedOTP) {
        if (otp === storedEncryptedOTP) {
          setOtpVerified(true);
          localStorage.removeItem("otp");
          toast.success("OTP verified");
        } else {
          setError("Invalid OTP. Please enter the correct OTP.");
        }
      } else {
        toast.error("no otp in storage");
      }
    } catch (error) {
      setError("Error validating OTP. Please try again later.");
      console.error("Error validating OTP:", error);
    }
  };

  if (status === "loading") {
    return <p>Registering...</p>;
  }
  if (session && session.user) {
    router.replace("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!otpVerified) {
        throw new Error(
          "Email verification required. Please verify your email before registering."
        );
      }
      const userType = isSSOUser ? "SSO user" : "native user";
      const response = await fetch("/api/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          checkbox1,
          checkbox2,
          checkbox3,
          userType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Registered");
      router.push("/");
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error);
    } finally {
    }
    setIsSubmitting(false);
  };

  const handleToggle = (event) => {
    setIsSSOUser(event.target.checked);
  };
  const handleBackButton = () => {
    setIsSSOUser(false);
    checkboxRef.current.checked = false;
  };

  return (
    <>
      <ReactCardFlip
        flipDirection="vertical"
        isFlipped={!isSSOUser}
        className={`flex align-middle justify-center ${
          !isSSOUser ? "flip-slow" : "flip-fast"
        }`}
      >
        <SSOUser handleBackButton={handleBackButton} />

        <div className="w-80 bg-white p-8 pt-2 rounded shadow-md flex flex-col">
          {isSubmitting && <Loader />}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row justify-between mb-2">
              <h3 className="font-bold text-2xl mb-3">Sign up </h3>
              <div className="flex items-center mb-3 mt-1 justify-center">
                <label
                  className="block text-gray-700 text-sm font-bold mr-2"
                  htmlFor="AcceptConditions"
                >
                  Native
                </label>
                <label
                  htmlFor="AcceptConditions"
                  className="relative h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
                >
                  <input
                    type="checkbox"
                    ref={checkboxRef}
                    id="AcceptConditions"
                    className="peer sr-only "
                    onChange={handleToggle}
                  />
                  <span className="absolute inset-y-0 h-4 w-5 start-0 m-1 size-5 rounded-full bg-white transition-all peer-checked:start-6"></span>
                </label>
                <label
                  className="block text-gray-700 text-sm font-bold ml-2"
                  htmlFor="AcceptConditions"
                >
                  SSO
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
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
                helperText={
                  error &&
                  error === "Email already exists! " && (
                    <div className="text-red-500 flex justify-left">
                      {error}
                    </div>
                  )
                }
              />
            </div>
            {otpSent ? (
              <div className="flex flex-row">
                <TextField
                  type="text"
                  label="Enter OTP"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  size="small"
                  helperText={
                    error &&
                    error === "Invalid OTP. Please enter the correct OTP." && (
                      <div className="text-red-500 ">Invalid OTP</div>
                    )
                  }
                />
                <button
                  variant="contained"
                  onClick={handleValidateOTP}
                  className={`p-1 my-auto ml-2 rounded-full  ${
                    otpVerified ? "bg-green-500" : "bg-lime-400"
                  }`}
                >
                  <FaCheckCircle
                    style={{ height: "1.5em", width: "1.5em" }}
                    className="text-white"
                  />
                </button>
              </div>
            ) : (
              email && (
                <button
                  variant="contained"
                  onClick={handleVerifyEmail}
                  className="bg-white text-sm text-lime-400 px-2 py-1 font-semibold hover:text-blue-500 ml-40  "
                >
                  Verify Email
                </button>
              )
            )}

            <div className="mb-4 mt-2">
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                required
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
            {/* ==================== */}
            <Checkbox
              id="checkbox1"
              checked={checkbox1}
              onChange={(e) => setCheckbox1(e.target.checked)}
              label="Cloud Assurance"
            />
            <Checkbox
              id="checkbox2"
              checked={checkbox2}
              onChange={(e) => setCheckbox2(e.target.checked)}
              label="KPI"
            />
            <Checkbox
              id="checkbox3"
              checked={checkbox3}
              onChange={(e) => setCheckbox3(e.target.checked)}
              label="Allocation"
            />
            {/* ==================== */}

            <button
              className="bg-lime-500 w-full mt-2 hover:bg-lime-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline self-end"
              type="submit"
            >
              Register
            </button>
          </form>
          <p className="mt-3">
            Already have an account?{" "}
            <strong>
              <Link className="text-blue-700 ml-3 underline" href="/">
                Sign in{" "}
              </Link>
            </strong>{" "}
          </p>
          {error &&
            error !== "Invalid OTP. Please enter the correct OTP." &&
            error !== "Email already exists! " && (
              <div className="bg-red-500 text-white px-2 py-1 text-sm my-2 rounded-md">
                {error}
              </div>
            )}
        </div>
      </ReactCardFlip>
    </>
  );
};

export default RegisterForm;
