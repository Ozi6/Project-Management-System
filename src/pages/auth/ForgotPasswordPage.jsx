import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage = () => {
  const {t} = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");

  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!successfulCreation) {
      // Request password reset
      await signIn
        ?.create({ strategy: "reset_password_email_code", identifier: email })
        .then(() => {
          setSuccessfulCreation(true);
          setError("");
        })
        .catch((err) => setError(err.errors[0].longMessage));
    } else {
      // Attempt password reset
      await signIn
        ?.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code,
          password,
        })
        .then((result) => {
          if (result.status === "complete") {
            window.location.href = "/login"; // Redirect to login after success
          }
        })
        .catch((err) => setError(err.errors[0].longMessage));
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--features-icon-color)]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {t("forgor.for")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!successfulCreation ? (
            <>
              <label className="block text-sm font-medium text-gray-700">
              {t("forgor.email")}
              </label>
              <input
                type="email"
                placeholder="e.g john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {t("forgor.send")}
              </button>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700">
              {t("forgor.pass")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block text-sm font-medium text-gray-700">
              {t("forgor.enter")}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {t("forgor.reset")}
              </button>
            </>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 text-sm hover:underline">
            {t("forgor.back")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
