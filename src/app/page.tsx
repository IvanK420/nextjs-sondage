"use client";

import { useState, useEffect } from "react";
import LogoutButton from "./components/LogoutButton";
import { RingLoader } from "react-spinners";

interface Sondage {
  _id: string;
  question: string;
  options: string[];
  createdAt: string;
  isActive: boolean;
}

interface Vote {
  _id: string;
  sondageId: string;
  optionId: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export default function Home() {
  const [sondages, setSondages] = useState<Sondage[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [sondageId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<{ [sondageId: string]: boolean }>({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sondagesRes, votesRes, sessionRes] = await Promise.all([
        fetch("/api/sondages"),
        fetch("/api/vote"),
        fetch("/api/session")
      ]);

      if (sondagesRes.ok) {
        const sondagesData = await sondagesRes.json();
        setSondages(sondagesData);
      }

      if (votesRes.ok) {
        const votesData = await votesRes.json();
        setVotes(votesData);
      }

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        setCurrentUser(sessionData.user);
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
    }
    setLoading(false);
  };

  const handleVote = async (sondageId: string) => {
    const selectedOption = selectedOptions[sondageId];
    if (!selectedOption) return;

    setVoting(prev => ({ ...prev, [sondageId]: true }));
    setError("");

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sondageId,
          optionId: selectedOption,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Recharger les données pour mettre à jour les résultats
        await fetchData();
        // Réinitialiser la sélection pour ce sondage
        setSelectedOptions(prev => ({ ...prev, [sondageId]: "" }));
      } else {
        setError(data.error || "Erreur lors du vote");
      }
    } catch (err) {
      setError("Erreur de connexion");
    }

    setVoting(prev => ({ ...prev, [sondageId]: false }));
  };

  const getVoteCounts = (sondageId: string) => {
    const sondageVotes = votes.filter(vote => vote.sondageId === sondageId);
    const counts: { [option: string]: number } = {};

    sondageVotes.forEach(vote => {
      counts[vote.optionId] = (counts[vote.optionId] || 0) + 1;
    });

    return counts;
  };

  const getTotalVotes = (sondageId: string) => {
    return votes.filter(vote => vote.sondageId === sondageId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#2a073f,_#120238,_#020114)]">
        <div className="flex flex-col items-center space-y-4">
          <RingLoader size={50} color="#10b981" />
          <p className="text-[#d3c6ff]">Chargement des sondages...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#2a073f,_#120238,_#020114)]">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="card card-compact holo-edge bg-[#0f0035]/70 backdrop-blur-lg shadow-[0_0_24px_rgba(189,1,255,0.5)] border border-[#9f4eff] p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#ffda57] via-[#ff5abf] to-[#b602ff] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,229,82,0.45)]">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Connexion requise</h2>
            <p className="text-[#d3c6ff] mb-6">Vous devez être connecté pour participer aux sondages</p>
            <div className="space-y-3">
              <a
                href="/login"
                className="btn-glow relative block w-full px-6 py-3 text-center font-semibold rounded-xl overflow-hidden"
              >
                Se connecter
              </a>
              <a
                href="/register"
                className="btn-glow relative block w-full px-6 py-3 text-center font-semibold rounded-xl overflow-hidden"
              >
                S&apos;inscrire
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#2a073f,_#120238,_#020114)] py-8">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Sondages Disponibles</h1>
          <p className="text-[#d3c6ff]">Participez aux sondages et consultez les résultats</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Sondages */}
        <div className="space-y-6">
          {sondages.length === 0 ? (
            <div className="card card-compact bg-[#0f0035]/80 backdrop-blur-lg shadow-[0_0_24px_rgba(189,1,255,0.5)] border border-[#9f4eff] p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#b602ff] via-[#7b00ff] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Aucun sondage disponible</h3>
              <p className="text-[#d3c6ff] mb-4">Soyez le premier à créer un sondage !</p>
              <a
                href="/sondage"
                className="btn-glow relative inline-flex items-center px-6 py-3 font-semibold rounded-xl overflow-hidden"
              >
                Créer un sondage
              </a>
            </div>
          ) : (
            sondages.map((sondage) => {
              const voteCounts = getVoteCounts(sondage._id);
              const totalVotes = getTotalVotes(sondage._id);
              const hasVoted = currentUser && votes.some(vote =>
                vote.sondageId === sondage._id && vote.userId === currentUser.id
              );

              return (
                <div key={sondage._id} className="card card-compact bg-[#0f0035]/80 backdrop-blur-lg shadow-[0_0_24px_rgba(189,1,255,0.5)] border border-[#9f4eff] p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">{sondage.question}</h3>
                    <p className="text-[#d3c6ff] text-sm">
                      {totalVotes} vote{totalVotes !== 1 ? 's' : ''} • Créé le {new Date(sondage.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {!hasVoted ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {sondage.options.map((option, index) => (
                          <label key={index} className="flex items-center p-4 border border-[#5f33ac] rounded-xl hover:border-[#c567ff] hover:bg-[#2f004f] transition-all duration-200 cursor-pointer">
                            <input
                              type="radio"
                              name={`sondage-${sondage._id}`}
                              value={option}
                              checked={selectedOptions[sondage._id] === option}
                              onChange={(e) => setSelectedOptions(prev => ({ ...prev, [sondage._id]: e.target.value }))}
                              className="w-4 h-4 text-[#8f7cfe] border-[#9a58ff] focus:ring-[#9a5cff]"
                            />
                            <span className="ml-3 text-[#f6f1ff] font-medium">{option}</span>
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={() => handleVote(sondage._id)}
                        disabled={!selectedOptions[sondage._id] || voting[sondage._id]}
                        className="w-full flex justify-center items-center px-6 py-4 btn-glow relative w-full flex justify-center items-center px-6 py-4 font-semibold rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {voting[sondage._id] ? (
                          <div className="flex items-center space-x-3">
                            <RingLoader size={20} color="#ffffff" />
                            <span>Vote en cours...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span>Voter</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-100 mb-4">Résultats</h4>
                      <div className="space-y-3">
                        {sondage.options.map((option, index) => {
                          const count = voteCounts[option] || 0;
                          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

                          return (
                            <div key={index} className="relative">
                              <div className="flex justify-between items-center mb-1">
                              <span className="text-[#f6f1ff] font-medium">{option}</span>
                                <span className="text-sm text-[#d3c6ff]">{count} vote{count !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-[#202051] rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-[#b602ff] to-[#00b8ff] h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-center pt-4 border-t border-[#5f33ac]">
                        <p className="text-[#8f7cfe] font-medium">Vous avez participé à ce sondage</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <a
            href="/sondage"
            className="btn-glow relative inline-flex items-center px-6 py-3 font-semibold rounded-xl overflow-hidden mr-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Créer un sondage
          </a>
        </div>

        {/* Logout button */}
        <div className="absolute bottom-4 right-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
