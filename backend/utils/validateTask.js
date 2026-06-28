const allowedStatus = ["pending", "in-progress", "completed"];
const allowedPriority = ["low", "medium", "high"];

export const validateTaskInput = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.title !== undefined) {
    const title = data.title?.trim();
    if (!title) {
      errors.title = "Title is required";
    } else if (title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (title.length > 80) {
      errors.title = "Title cannot exceed 80 characters";
    }
  }

  if (data.description && data.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  if (data.status && !allowedStatus.includes(data.status)) {
    errors.status = "Invalid task status";
  }

  if (data.priority && !allowedPriority.includes(data.priority)) {
    errors.priority = "Invalid task priority";
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      errors.dueDate = "Invalid due date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
