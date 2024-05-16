// components/GoogleButton.js

import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const GoogleButton = () => {
  const router = useRouter(); // Initialize the router
  const session = useSession();

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" }); // Specify the callbackUrl to navigate to Dashboard
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-white  p-1 relative inline-block items-center  justify-center  focus:outline-none "
    >
      <div className="relative group">
        <div className="absolute top-full  left-1/2 transform text-black -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Google
        </div>
        <FcGoogle style={{ fontSize: "25px" }} />
      </div>
    </button>
  );
};

export default GoogleButton;
