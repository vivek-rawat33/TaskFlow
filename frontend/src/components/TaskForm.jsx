import React, { useEffect, useRef, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

const TITLE_MIN = 3;
const TITLE_MAX = 80;
const DESCRIPTION_MAX = 500;

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const validateForm = (formData) => {
  const errors = {};
  const title = formData.title.trim();

  if (!title) {
    errors.title = "Title is required";
  } else if (title.length < TITLE_MIN) {
    errors.title = `Title must be at least ${TITLE_MIN} characters`;
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title cannot exceed ${TITLE_MAX} characters`;
  }

  if (formData.description.length > DESCRIPTION_MAX) {
    errors.description = `Description cannot exceed ${DESCRIPTION_MAX} characters`;
  }

  return errors;
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().split("T")[0];
};

function TaskForm({ editingTask, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Closes the race window between a click and the parent re-rendering
  // with isSubmitting=true. Refs are synchronous, props are not.
  const submittingRef = useRef(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        dueDate: formatDateForInput(editingTask.dueDate),
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Belt-and-suspenders: block re-entry even if the parent hasn't
    // re-rendered with isSubmitting=true yet.
    if (submittingRef.current || isSubmitting) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    submittingRef.current = true;
    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
      });

      if (!editingTask) {
        setFormData(emptyForm);
      }
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {editingTask ? "Edit Task" : "New Task"}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          {editingTask ? "Update your task" : "Create a task"}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={TITLE_MAX}
            placeholder="Example: Complete DSA assignment"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "task-title-error" : undefined}
            className={inputClass}
          />
          {errors.title && (
            <p id="task-title-error" className="mt-1 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            maxLength={DESCRIPTION_MAX}
            placeholder="Add task details..."
            aria-invalid={Boolean(errors.description)}
            className={`${inputClass} resize-none`}
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span className={errors.description ? "text-red-600" : ""}>
              {errors.description || "Optional"}
            </span>
            <span>
              {formData.description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="task-status"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>
            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-dueDate"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Due Date
            </label>
            <input
              id="task-dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {isSubmitting
            ? "Saving..."
            : editingTask
              ? "Save Changes"
              : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default React.memo(TaskForm);
