"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  useEffect(() => {
    if (status === "authenticated") fetchTasks();
  }, [status]);

  const addTask = async () => {
    if (!newTask.title.trim()) {
      setMessage({ type: "error", text: "⚠️ Title is required!" });
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "✅ Task added successfully!" });
        setNewTask({ title: "", description: "" });
        fetchTasks();
      } else {
        setMessage({ type: "error", text: data.error || "❌ Failed to add task." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "🚨 Server error. Please try again!" });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const deleteTask = async (title) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ title }),
    });
    fetchTasks();
  };

  const saveEdit = async (task, i) => {
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldTitle: task.oldTitle || task.title,
        title: task.title,
        description: task.description,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: "success", text: "✅ Task updated!" });
      fetchTasks();
    } else {
      setMessage({ type: "error", text: data.error || "❌ Update failed" });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  if (status === "loading") return <p className="text-white">Loading...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">
        Welcome, {session?.user?.name || "User"} 👋
      </h1>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-red-600 text-white px-4 py-2 rounded mb-8 hover:bg-red-700 transition"
      >
        Sign Out
      </button>

      <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Your Tasks</h2>

        {/* ✅ Notification */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium ${
              message.type === "success"
                ? "bg-green-700/40 border border-green-500 text-green-300"
                : "bg-red-700/40 border border-red-500 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Task Form */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="📝 Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <textarea
            placeholder="💬 Task description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            rows="3"
          ></textarea>
          <button
            onClick={addTask}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task, i) => (
              <li
                key={i}
                className="flex flex-col bg-gray-800 border border-gray-700 p-3 rounded-lg"
              >
                {task.isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((t, idx) =>
                            idx === i ? { ...t, title: e.target.value } : t
                          )
                        )
                      }
                      className="w-full bg-gray-700 p-2 rounded text-gray-100"
                    />
                    <textarea
                      value={task.description || ""}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((t, idx) =>
                            idx === i ? { ...t, description: e.target.value } : t
                          )
                        )
                      }
                      className="w-full bg-gray-700 p-2 rounded text-gray-100"
                      rows="2"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(task, i)}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((t, idx) =>
                              idx === i ? { ...t, isEditing: false } : t
                            )
                          )
                        }
                        className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
                      >
                        ✖ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-200">{task.title}</h3>
                      {task.description && (
                        <p className="text-gray-400 text-sm">{task.description}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((t, idx) =>
                              idx === i ? { ...t, isEditing: true } : t
                            )
                          )
                        }
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.title)}
                        className="text-red-400 hover:text-red-300"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">No tasks yet. Add one!</p>
        )}
      </div>
    </main>
  );
}
