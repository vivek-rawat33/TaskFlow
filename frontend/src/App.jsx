// import { useEffect, useMemo, useState } from "react";
// import { createTeamTask, deleteTask, getTasks, updateTask } from "./api/taskApi.js";
// import FilterBar from "./components/FilterBar.jsx";
// import TaskForm from "./components/TaskForm.jsx";
// import TaskList from "./components/TaskList.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login-page.jsx";
import SignupPage from "./pages/Signup-page.jsx";
const defaultFilters = {
  search: "",
  status: "all",
  priority: "all",
};
import { Dashboard } from "./pages/Dashboard";

function App() {
  // const [tasks, setTasks] = useState([]);
  // const [filters, setFilters] = useState(defaultFilters);
  // const [editingTask, setEditingTask] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [error, setError] = useState("");

  // const fetchTasks = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     const data = await getTasks(filters);
  //     setTasks(data);
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message ||
  //         "Unable to load tasks. Check backend and MongoDB connection.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const timeoutId = setTimeout(fetchTasks, 300);
  //   return () => clearTimeout(timeoutId);
  // }, [filters]);

  // const stats = useMemo(() => {
  //   return {
  //     total: tasks.length,
  //     pending: tasks.filter((task) => task.status === "pending").length,
  //     inProgress: tasks.filter((task) => task.status === "in-progress").length,
  //     completed: tasks.filter((task) => task.status === "completed").length,
  //   };
  // }, [tasks]);

  // const handleSubmitTask = async (taskData) => {
  //   try {
  //     setIsSubmitting(true);
  //     setError("");

  //     if (editingTask) {
  //       const updated = await updateTask(editingTask._id, taskData);
  //       setTasks((prev) =>
  //         prev.map((task) => (task._id === updated._id ? updated : task)),
  //       );
  //       setEditingTask(null);
  //     } else {
  //       const created = await createTask(taskData);
  //       setTasks((prev) => [created, ...prev]);
  //     }
  //   } catch (err) {
  //     const validationErrors = err.response?.data?.errors;
  //     const firstValidationError = validationErrors
  //       ? Object.values(validationErrors)[0]
  //       : null;

  //     setError(
  //       firstValidationError ||
  //         err.response?.data?.message ||
  //         "Task save failed",
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleDeleteTask = async (id) => {
  //   const shouldDelete = window.confirm("Delete this task?");
  //   if (!shouldDelete) return;

  //   try {
  //     setError("");
  //     await deleteTask(id);
  //     setTasks((prev) => prev.filter((task) => task._id !== id));

  //     if (editingTask?._id === id) {
  //       setEditingTask(null);
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Task delete failed");
  //   }
  // };

  // const handleFilterChange = (name, value) => {
  //   setFilters((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleClearFilters = () => {
  //   setFilters(defaultFilters);
  // };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>

    // <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    //   <div className="mx-auto max-w-6xl">
    //     <section className="mb-8 overflow-hidden rounded-4xl bg-slate-950 px-6 py-8 text-white shadow-lg sm:px-8">
    //       <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
    //         <div>
    //           <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
    //             MERN Stack Project
    //           </p>
    //           <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
    //             Task Tracker
    //           </h1>
    //           <p className="mt-4 max-w-2xl text-slate-300">
    //             Create, view, update and delete tasks using React, Express REST
    //             APIs, MongoDB and Tailwind CSS v4.
    //           </p>
    //         </div>

    //         <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
    //           <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
    //             <p className="text-2xl font-black">{stats.total}</p>
    //             <p className="text-sm text-slate-300">Total</p>
    //           </div>
    //           <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
    //             <p className="text-2xl font-black">{stats.pending}</p>
    //             <p className="text-sm text-slate-300">Pending</p>
    //           </div>
    //           <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
    //             <p className="text-2xl font-black">{stats.inProgress}</p>
    //             <p className="text-sm text-slate-300">Progress</p>
    //           </div>
    //           <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
    //             <p className="text-2xl font-black">{stats.completed}</p>
    //             <p className="text-sm text-slate-300">Done</p>
    //           </div>
    //         </div>
    //       </div>
    //     </section>

    //     {error && (
    //       <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
    //         {error}
    //       </div>
    //     )}

    //     <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:items-start">
    //       <TaskForm
    //         editingTask={editingTask}
    //         onSubmit={handleSubmitTask}
    //         onCancel={() => setEditingTask(null)}
    //         isSubmitting={isSubmitting}
    //       />

    //       <section className="space-y-5">
    //         <FilterBar
    //           filters={filters}
    //           onFilterChange={handleFilterChange}
    //           onClear={handleClearFilters}
    //         />
    //         <TaskList
    //           tasks={tasks}
    //           loading={loading}
    //           onEdit={setEditingTask}
    //           onDelete={handleDeleteTask}
    //         />
    //       </section>
    //     </div>
    //   </div>
    // </main>
  );
}

export default App;
