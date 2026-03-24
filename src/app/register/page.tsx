"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export type Error = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({ email, name, password });
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      e.target.reset();
      router.push("/");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Créer un compte
            </h2>
            <p className="text-gray-600">Rejoignez notre communauté</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nom complet
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-4 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-4 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-4 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <RingLoader size={20} color="#ffffff" />
                  <span>Création du compte...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span>Créer mon compte</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <a
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
