import { Loader2 } from "lucide-react";
import React from "react";

const AuthLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white">
      <Loader2 size={64} color="blue"/>
    </div>
  );
};

export default AuthLoader;
