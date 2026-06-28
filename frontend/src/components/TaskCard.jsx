const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 ring-blue-200",
  completed: "bg-green-100 text-green-800 ring-green-200",
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-700 ring-slate-200",
  medium: "bg-orange-100 text-orange-800 ring-orange-200",
  high: "bg-red-100 text-red-800 ring-red-200",
};

const readableText = (value) => {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No due date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
};

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500">Due: {formatDate(task.dueDate)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-4 text-sm leading-6 text-slate-600">{task.description}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
            statusStyles[task.status]
          }`}
        >
          {readableText(task.status)}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
            priorityStyles[task.priority]
          }`}
        >
          {readableText(task.priority)} Priority
        </span>
      </div>
    </article>
  );
}

export default TaskCard;
