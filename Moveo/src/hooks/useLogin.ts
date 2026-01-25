import { useState } from "react";

export default function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoginDisabled = email.trim() === "" || password.trim() === "";

  return {
    email,
    password,
    isLoginDisabled,
    handleEmailChange: setEmail,
    handlePasswordChange: setPassword,
  };
}
