"use client";

import { useState, useEffect } from "react";

interface Survey {
  _id: string;
  demographics: any;
  video: any;
  freeRecall: any;
  multipleChoice: any;
  cognitiveLoad: any;
  distraction: any;
  engagement: any;
  manipulationCheck: any;
  qualityControl: any;
  startedAt: string;
  completedAt: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          loadSurveys();
        } else {
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/surveys");
      if (response.ok) {
        const data = await response.json();
        setSurveys(data.surveys);
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Failed to load surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadSurveys();
      } else {
        setLoginError("Invalid credentials");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setSurveys([]);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("/api/admin/export");
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `survey-results-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to export CSV");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate statistics for graphs
  const calculateStats = () => {
    if (surveys.length === 0) return null;

    const stats: any = {
      demographics: {
        gender: {} as Record<string, number>,
        age: { avg: 0, min: Infinity, max: 0 },
        education: {} as Record<string, number>,
      },
      cognitiveLoad: {
        mentalEffort: { avg: 0, values: [] as number[] },
        concentrateHard: { avg: 0, values: [] as number[] },
        mentallyDemanding: { avg: 0, values: [] as number[] },
        easyToFollow: { avg: 0, values: [] as number[] },
      },
      engagement: {
        videoEngaging: { avg: 0, values: [] as number[] },
        wouldKeepWatching: { avg: 0, values: [] as number[] },
        visualsEnjoyable: { avg: 0, values: [] as number[] },
      },
      qualityControl: {
        watchedEntireVideo: { yes: 0, no: 0 },
        wasMultitasking: { yes: 0, no: 0 },
        attentionCheck: {} as Record<string, number>,
      },
    };

    surveys.forEach((survey) => {
      // Demographics
      if (survey.demographics) {
        const gender = survey.demographics.gender;
        if (gender) stats.demographics.gender[gender] = (stats.demographics.gender[gender] || 0) + 1;

        const age = parseInt(survey.demographics.age);
        if (!isNaN(age)) {
          stats.demographics.age.avg += age;
          stats.demographics.age.min = Math.min(stats.demographics.age.min, age);
          stats.demographics.age.max = Math.max(stats.demographics.age.max, age);
        }

        const education = survey.demographics.education;
        if (education) stats.demographics.education[education] = (stats.demographics.education[education] || 0) + 1;
      }

      // Cognitive Load
      if (survey.cognitiveLoad) {
        Object.keys(stats.cognitiveLoad).forEach((key) => {
          const value = survey.cognitiveLoad[key];
          if (value !== null && value !== undefined) {
            stats.cognitiveLoad[key].values.push(value);
          }
        });
      }

      // Engagement
      if (survey.engagement) {
        Object.keys(stats.engagement).forEach((key) => {
          const value = survey.engagement[key];
          if (value !== null && value !== undefined) {
            stats.engagement[key].values.push(value);
          }
        });
      }

      // Quality Control
      if (survey.qualityControl) {
        if (survey.qualityControl.watchedEntireVideo === true) stats.qualityControl.watchedEntireVideo.yes++;
        if (survey.qualityControl.watchedEntireVideo === false) stats.qualityControl.watchedEntireVideo.no++;
        if (survey.qualityControl.wasMultitasking === true) stats.qualityControl.wasMultitasking.yes++;
        if (survey.qualityControl.wasMultitasking === false) stats.qualityControl.wasMultitasking.no++;
        
        const attentionCheck = survey.qualityControl.attentionCheck;
        if (attentionCheck) {
          stats.qualityControl.attentionCheck[attentionCheck] = (stats.qualityControl.attentionCheck[attentionCheck] || 0) + 1;
        }
      }
    });

    // Calculate averages
    stats.demographics.age.avg = stats.demographics.age.avg / surveys.length;
    if (stats.demographics.age.min === Infinity) stats.demographics.age.min = 0;

    Object.keys(stats.cognitiveLoad).forEach((key) => {
      const values = stats.cognitiveLoad[key].values;
      if (values.length > 0) {
        stats.cognitiveLoad[key].avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      }
    });

    Object.keys(stats.engagement).forEach((key) => {
      const values = stats.engagement[key].values;
      if (values.length > 0) {
        stats.engagement[key].avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-zinc-50">
              Admin Login
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-foreground"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-600 dark:text-red-400 text-sm">{loginError}</div>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-foreground text-background rounded-lg hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
              Total Responses: {surveys.length}
            </h2>
            <button
              onClick={handleExportCSV}
              disabled={isExporting || surveys.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? "Exporting..." : "Download CSV"}
            </button>
          </div>
        </div>

        {/* Statistics Graphs */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Demographics */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Demographics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Average Age: {stats.demographics.age.avg.toFixed(1)}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Range: {stats.demographics.age.min} - {stats.demographics.age.max}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-zinc-50 mb-2">Gender Distribution</p>
                  {Object.entries(stats.demographics.gender).map(([gender, count]) => (
                    <div key={gender} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 dark:text-zinc-300">{gender}</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{count as number}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-foreground h-2 rounded-full"
                          style={{ width: `${((count as number) / surveys.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cognitive Load */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Cognitive Load (Average)</h3>
              <div className="space-y-3">
                {Object.entries(stats.cognitiveLoad).map(([key, data]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{data.avg.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(data.avg / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Engagement (Average)</h3>
              <div className="space-y-3">
                {Object.entries(stats.engagement).map(([key, data]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{data.avg.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.avg / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Control */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Quality Control</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-black dark:text-zinc-50 mb-2">Watched Entire Video</p>
                  <div className="flex gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 dark:text-zinc-300">Yes</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{stats.qualityControl.watchedEntireVideo.yes}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.qualityControl.watchedEntireVideo.yes / surveys.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 dark:text-zinc-300">No</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{stats.qualityControl.watchedEntireVideo.no}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(stats.qualityControl.watchedEntireVideo.no / surveys.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-zinc-50 mb-2">Was Multitasking</p>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 dark:text-zinc-300">Yes</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{stats.qualityControl.wasMultitasking.yes}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(stats.qualityControl.wasMultitasking.yes / surveys.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 dark:text-zinc-300">No</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{stats.qualityControl.wasMultitasking.no}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.qualityControl.wasMultitasking.no / surveys.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Survey Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">All Responses</h2>
          {surveys.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">No survey responses yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-100 dark:bg-zinc-700">
                  <tr>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Date</th>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Age</th>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Gender</th>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Education</th>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Video</th>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Watched Entire</th>
                    <th className="px-4 py-3 text-zinc-700 dark:text-zinc-300">Multitasking</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr
                      key={survey._id}
                      className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    >
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.completedAt
                          ? new Date(survey.completedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.demographics?.age || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.demographics?.gender || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.demographics?.education || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.video?.filename || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.qualityControl?.watchedEntireVideo === true
                          ? "Yes"
                          : survey.qualityControl?.watchedEntireVideo === false
                          ? "No"
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {survey.qualityControl?.wasMultitasking === true
                          ? "Yes"
                          : survey.qualityControl?.wasMultitasking === false
                          ? "No"
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

