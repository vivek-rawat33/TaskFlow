import * as React from "react";
import { z } from "zod";
import { createTeamTask, deleteTeamTask, updateTeamTask } from "@/api/taskApi";
import { cn } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DatePicker } from "./ui/date-picker";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GripVerticalIcon,
  CircleCheckIcon,
  LoaderIcon,
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  CircleIcon,
  SearchIcon,
} from "lucide-react";
import { notify } from "./ui/toast";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  "General",
  "Frontend",
  "Backend",
  "UI",
  "Feature",
  "Bug Fix",
  "Planning",
  "Research",
  "Technical content",
  "Narrative",
  "Legal",
  "Visual",
  "Financial",
  "Cover page",
  "Table of contents",
  "Plain language",
];

const STATUS_OPTIONS = ["Todo", "In Process", "Done"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const COLUMN_LABELS = {
  header: "Task",
  type: "Category",
  status: "Status",
  target: "Deadline",
  limit: "Priority",
  reviewer: "Assigned To",
};

const PRIORITY_STYLES = {
  High: {
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300",
    dot: "bg-red-500",
  },
  Medium: {
    badge:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300",
    dot: "bg-purple-500",
  },
  Low: {
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300",
    dot: "bg-blue-500",
  },
};

const EMPTY_TASK = {
  header: "",
  description: "",
  type: "Frontend",
  status: "Todo",
  target: "",
  limit: "Medium",
  reviewer: "Unassigned",
  assignedToId: "",
};

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function getPriorityStyles(priority) {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
}

function formatDeadline(value) {
  if (!value) return "No deadline";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Resolves a select value ("__unassigned" | memberId) into the
// { assignedToId, reviewer } pair every assignment flow needs.
// `fallbackReviewer` is only used when merging a partial update where the
// member list doesn't (yet) contain a match — mirrors the previous inline logic.
function resolveAssignee(members, value, fallbackReviewer) {
  if (!value || value === "__unassigned") {
    return { assignedToId: "", reviewer: "Unassigned" };
  }

  const member = members.find((m) => String(m.id) === String(value));

  return {
    assignedToId: value,
    reviewer: member?.name || fallbackReviewer || "Unknown user",
  };
}

function toBackendStatus(status) {
  if (status === "Todo") return "pending";
  if (status === "In Process") return "in-progress";
  if (status === "Done") return "completed";
  return "pending";
}

function toBackendPriority(priority) {
  if (priority === "High") return "high";
  if (priority === "Medium") return "medium";
  if (priority === "Low") return "low";
  return "medium";
}

function toFrontendStatus(status) {
  if (status === "pending") return "Todo";
  if (status === "in-progress") return "In Process";
  if (status === "completed") return "Done";
  return status || "Todo";
}

function toFrontendPriority(priority) {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  if (priority === "low") return "Low";
  return priority || "Medium";
}

function formatTaskForTable(task) {
  const assignedToId =
    typeof task.assignedTo === "object" && task.assignedTo !== null
      ? String(task.assignedTo._id || task.assignedTo.id || "")
      : task.assignedTo
        ? String(task.assignedTo)
        : "";

  return {
    id: task._id || task.id,
    header: task.title || "Untitled Task",
    description: task.description || "",
    type: task.category || "General",
    status: toFrontendStatus(task.status),
    target: task.dueDate ? task.dueDate.split("T")[0] : "",
    limit: toFrontendPriority(task.priority),
    reviewer: task.assignedTo?.name || "Unassigned",
    assignedToId,
  };
}

// ---------------------------------------------------------------------------
// Small shared components
// ---------------------------------------------------------------------------

const DragHandle = React.memo(function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
});

// Used by: the table's Assignee cell, the add-task form, and the edit drawer —
// previously reimplemented four times with slightly different markup.
function MemberSelect({ id, value, members, disabled, onChange, className }) {
  return (
    <Select
      value={String(value || "__unassigned")}
      disabled={disabled}
      onValueChange={onChange}
    >
      <SelectTrigger id={id} className={className || "w-full"}>
        <SelectValue placeholder="Assign member" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="__unassigned">Unassigned</SelectItem>

          {members.map((member) => (
            <SelectItem key={member.id} value={String(member.id)}>
              {member.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// The task title/description/category/status/deadline/priority/assignee
// fields, shared by the mobile "add task" drawer, the desktop "add task"
// dialog, and the per-row edit drawer. Previously this whole block was
// duplicated three times (~250 lines) and could drift out of sync.
function TaskFormFields({
  idPrefix,
  values,
  onFieldChange,
  onAssigneeChange,
  members,
  disabled = {},
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Label htmlFor={`${idPrefix}-header`}>Task Title</Label>
        <Input
          id={`${idPrefix}-header`}
          value={values.header}
          disabled={disabled.header}
          onChange={(e) => onFieldChange("header", e.target.value)}
          placeholder="Example: Build dashboard layout"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          value={values.description}
          disabled={disabled.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Add more details about this task..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor={`${idPrefix}-category`}>Category</Label>
          <Select
            value={values.type}
            disabled={disabled.type}
            onValueChange={(value) => onFieldChange("type", value)}
          >
            <SelectTrigger id={`${idPrefix}-category`} className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <Select
            value={values.status}
            disabled={disabled.status}
            onValueChange={(value) => onFieldChange("status", value)}
          >
            <SelectTrigger id={`${idPrefix}-status`} className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor={`${idPrefix}-deadline`}>Deadline</Label>
          <DatePicker
            value={values.target}
            onChange={(value) => onFieldChange("target", value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor={`${idPrefix}-priority`}>Priority</Label>
          <Select
            value={values.limit}
            disabled={disabled.limit}
            onValueChange={(value) => onFieldChange("limit", value)}
          >
            <SelectTrigger id={`${idPrefix}-priority`} className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor={`${idPrefix}-assignee`}>Assigned To</Label>
        <MemberSelect
          id={`${idPrefix}-assignee`}
          value={values.assignedToId}
          members={members}
          disabled={disabled.assignedToId}
          onChange={onAssigneeChange}
        />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const columns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    meta: { headerClassName: "w-10", cellClassName: "w-10" },
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { headerClassName: "w-10", cellClassName: "w-10" },
  },
  {
    accessorKey: "header",
    header: "Task",
    cell: ({ row, table }) => (
      <TableCellViewer
        item={row.original}
        onSaveTask={table.options.meta?.updateTask}
        members={table.options.meta?.members || []}
        canManageTasks={table.options.meta?.canManageTasks}
        isMember={table.options.meta?.isMember}
        currentUserId={table.options.meta?.currentUserId}
      />
    ),
    enableHiding: false,
    meta: {
      headerClassName: "w-[280px] min-w-[280px] max-w-[280px]",
      cellClassName: "w-[280px] min-w-[280px] max-w-[280px] overflow-hidden",
    },
  },
  {
    accessorKey: "type",
    header: "Category",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="max-w-32.5 truncate px-2 text-muted-foreground"
        title={row.original.type}
      >
        {row.original.type}
      </Badge>
    ),
    meta: { headerClassName: "w-[170px]", cellClassName: "w-[170px]" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant="outline"
          className="gap-1.5 px-1.5 text-muted-foreground"
        >
          {status === "Done" ? (
            <CircleCheckIcon className="size-3.5 fill-green-500 dark:fill-green-400" />
          ) : status === "In Process" ? (
            <LoaderIcon className="size-3.5" />
          ) : (
            <CircleIcon className="size-3.5" />
          )}
          {status}
        </Badge>
      );
    },
    meta: { headerClassName: "w-[150px]", cellClassName: "w-[150px]" },
  },
  {
    accessorKey: "target",
    header: "Deadline",
    cell: ({ row }) => (
      <div className="text-right text-sm text-muted-foreground">
        {formatDeadline(row.original.target)}
      </div>
    ),
    meta: {
      headerClassName: "w-[150px] text-right",
      cellClassName: "w-[150px] text-right",
    },
  },
  {
    accessorKey: "limit",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.original.limit || "Medium";
      const styles = getPriorityStyles(priority);

      return (
        <div className="flex justify-end">
          <Badge
            variant="outline"
            className={`gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${styles.badge}`}
          >
            <span className={`size-1.5 rounded-full ${styles.dot}`} />
            {priority}
          </Badge>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[130px] text-right",
      cellClassName: "w-[130px] text-right",
    },
  },
  {
    accessorKey: "reviewer",
    header: "Assignee",
    cell: ({ row, table }) => {
      const members = table.options.meta?.members || [];

      return (
        <MemberSelect
          value={row.original.assignedToId}
          members={members}
          disabled={!table.options.meta?.canManageTasks}
          className="w-full min-w-40 lg:min-w-0"
          onChange={(value) => {
            table.options.meta?.updateTask(
              row.original.id,
              resolveAssignee(members, value),
            );
          }}
        />
      );
    },
    meta: {
      headerClassName: "w-[180px] min-w-[180px] lg:w-auto lg:min-w-0",
      cellClassName: "w-[180px] min-w-[180px] lg:w-auto lg:min-w-0",
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {(table.options.meta?.canManageTasks ||
              (table.options.meta?.isMember &&
                String(row.original.assignedToId) ===
                  String(table.options.meta?.currentUserId))) && (
              <DropdownMenuItem
                onClick={() =>
                  table.options.meta?.markTaskDone(row.original.id)
                }
              >
                Mark completed
              </DropdownMenuItem>
            )}

            {table.options.meta?.canManageTasks && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    table.options.meta?.deleteTask(row.original.id)
                  }
                >
                  Delete task
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { headerClassName: "w-12", cellClassName: "w-12" },
  },
];

function DraggableRow({ row }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            "h-14 whitespace-nowrap px-4 align-middle",
            cell.column.columnDef.meta?.cellClassName,
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// ---------------------------------------------------------------------------
// Main table
// ---------------------------------------------------------------------------

export const DataTable = React.memo(function DataTable({
  data: initialData,
  teamId,
  members = [],
  currentUserRole,
  currentUserId = "",
  onTasksChange,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [data, setData] = React.useState(() => initialData || []);
  const [view, setView] = React.useState("all");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState(EMPTY_TASK);

  // `isAddingTask` drives the button's visual disabled/loading state.
  // `addingTaskRef` is the real guard: state updates land on the *next*
  // render, so a fast double-click can fire handleAddTask twice before
  // React ever shows the button as disabled. The ref is set synchronously,
  // so the second call bails out immediately regardless of render timing.
  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const addingTaskRef = React.useRef(false);

  const isMobile = useIsMobile();

  const canManageTasks =
    currentUserRole === "owner" || currentUserRole === "admin";
  const isMember = currentUserRole === "member";

  // Was previously two separate effects doing the same sync — merged into one.
  React.useEffect(() => {
    setData(initialData || []);
  }, [initialData]);

  const sortableId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const counts = React.useMemo(
    () => ({
      all: data.length,
      inProcess: data.filter((task) => task.status === "In Process").length,
      completed: data.filter((task) => task.status === "Done").length,
      unassigned: data.filter(
        (task) => !task.assignedToId || task.reviewer === "Unassigned",
      ).length,
    }),
    [data],
  );

  const refreshParentTasks = async () => {
    if (typeof onTasksChange === "function") {
      await onTasksChange();
    }
  };

  const filteredData = React.useMemo(() => {
    let tasks = data;

    if (view === "in-process")
      tasks = tasks.filter((t) => t.status === "In Process");
    if (view === "completed") tasks = tasks.filter((t) => t.status === "Done");
    if (view === "unassigned") {
      tasks = tasks.filter(
        (t) => !t.assignedToId || t.reviewer === "Unassigned",
      );
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return tasks;

    return tasks.filter((task) => {
      const searchableText = [
        task.header,
        task.type,
        task.status,
        task.target,
        task.limit,
        task.reviewer,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [data, view, searchQuery]);

  const dataIds = React.useMemo(
    () => filteredData?.map(({ id }) => id) || [],
    [filteredData],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta: {
      deleteTask,
      markTaskDone,
      updateTask,
      members,
      canManageTasks,
      isMember,
      currentUserId,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleDragEnd = React.useCallback((event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    setData((currentData) => {
      const oldIndex = currentData.findIndex((task) => task.id === active.id);
      const newIndex = currentData.findIndex((task) => task.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return currentData;
      return arrayMove(currentData, oldIndex, newIndex);
    });
  }, []);

  function handleNewTaskFieldChange(field, value) {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  }

  function handleNewTaskAssigneeChange(value) {
    setNewTask((prev) => ({ ...prev, ...resolveAssignee(members, value) }));
  }

  async function handleAddTask(e) {
    e.preventDefault();

    // Bail out instantly on a repeat click while a create is in flight.
    if (addingTaskRef.current) return;

    const taskTitle = newTask.header.trim();

    if (!taskTitle) {
      notify.error("Task title is required");
      return;
    }

    if (!teamId) {
      notify.error("Team ID missing");
      return;
    }

    addingTaskRef.current = true;
    setIsAddingTask(true);

    try {
      const taskPayload = {
        title: taskTitle,
        description: newTask.description?.trim() || "",
        category: newTask.type,
        status: toBackendStatus(newTask.status),
        priority: toBackendPriority(newTask.limit),
        dueDate: newTask.target || null,
        assignedTo: newTask.assignedToId || null,
      };

      await createTeamTask(teamId, taskPayload);

      // `refreshParentTasks` re-syncs `data` from the server via the
      // `initialData` effect above — that's now the single source of truth
      // for the new row. We previously ALSO prepended a locally-formatted
      // task into `data` right after this, which is what was causing the
      // task to appear twice: once from the server sync, once from the
      // manual prepend. Removed — do not add it back without removing the
      // refresh, or vice versa.
      await refreshParentTasks();

      setNewTask(EMPTY_TASK);
      setIsAddTaskOpen(false);
      setView("all");
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));

      notify.success("Task created successfully");
    } catch (error) {

      notify.error(error.response?.data?.message || "Failed to create task");
    } finally {
      addingTaskRef.current = false;
      setIsAddingTask(false);
    }
  }

  async function deleteTask(taskId) {
    if (!teamId) {
      notify.error("Team ID missing");
      return;
    }

    try {
      await deleteTeamTask(teamId, taskId);
      await refreshParentTasks();

      setData((currentData) =>
        currentData.filter((task) => String(task.id) !== String(taskId)),
      );

      // Keep selection state in sync so counts/"select all" don't reference
      // a row that no longer exists.
      setRowSelection((prev) => {
        if (!(String(taskId) in prev)) return prev;
        const next = { ...prev };
        delete next[String(taskId)];
        return next;
      });

      notify.success("Task deleted successfully");
    } catch (error) {

      notify.error(error.response?.data?.message || "Failed to delete task");
    }
  }

  async function markTaskDone(taskId) {
    await updateTask(taskId, { status: "Done" });
  }

  async function updateTask(taskId, updatedTask) {
    if (!teamId) {
      notify.error("Team ID missing");
      return;
    }

    const previousData = data;
    const currentTask = data.find((task) => String(task.id) === String(taskId));

    if (!currentTask) {
      notify.error("Task not found");
      return;
    }

    const mergedTask = { ...currentTask, ...updatedTask };
    const updatedUiTask = {
      ...mergedTask,
      ...resolveAssignee(members, mergedTask.assignedToId, mergedTask.reviewer),
    };

    setData((currentData) =>
      currentData.map((task) =>
        String(task.id) === String(taskId) ? updatedUiTask : task,
      ),
    );

    try {
      const payload = {};
      if (updatedTask.header !== undefined) payload.title = mergedTask.header;
      if (updatedTask.description !== undefined)
        payload.description = mergedTask.description || "";
      if (updatedTask.type !== undefined) payload.category = mergedTask.type;
      if (updatedTask.status !== undefined)
        payload.status = toBackendStatus(mergedTask.status);
      if (updatedTask.limit !== undefined)
        payload.priority = toBackendPriority(mergedTask.limit);
      if (updatedTask.target !== undefined)
        payload.dueDate = mergedTask.target || null;
      if (updatedTask.assignedToId !== undefined)
        payload.assignedTo = mergedTask.assignedToId || null;

      await updateTeamTask(teamId, taskId, payload);
      await refreshParentTasks();

      notify.success("Task updated successfully");
    } catch (error) {

      setData(previousData);
      notify.error(error.response?.data?.message || "Failed to update task");
    }
  }

  const addTaskForm = (
    <TaskFormFields
      idPrefix="new-task"
      values={newTask}
      onFieldChange={handleNewTaskFieldChange}
      onAssigneeChange={handleNewTaskAssigneeChange}
      members={members}
    />
  );

  return (
    <Tabs
      value={view}
      onValueChange={(value) => {
        setView(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setRowSelection({});
      }}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>

        <Select value={view} onValueChange={setView}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="in-process">In Process</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">
            All Tasks <Badge variant="secondary">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-process">
            In Process <Badge variant="secondary">{counts.inProcess}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge variant="secondary">{counts.completed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unassigned">
            Unassigned <Badge variant="secondary">{counts.unassigned}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                setRowSelection({});
              }}
              placeholder="Search tasks..."
              className="h-8 w-55 pl-8 lg:w-65"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columns
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {COLUMN_LABELS[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {canManageTasks &&
            (isMobile ? (
              <Drawer
                open={isAddTaskOpen}
                onOpenChange={(open) => {
                  // Block closing the sheet mid-submit so the in-flight
                  // request can't get orphaned from its form state.
                  if (isAddingTask) return;
                  setIsAddTaskOpen(open);
                }}
              >
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">Add Task</span>
                  </Button>
                </DrawerTrigger>

                <DrawerContent className="max-h-[85vh]">
                  <DrawerHeader className="gap-1 text-left">
                    <DrawerTitle>Add New Task</DrawerTitle>
                    <DrawerDescription>
                      Create a task, assign it to a member and set its priority.
                    </DrawerDescription>
                  </DrawerHeader>

                  <form
                    onSubmit={handleAddTask}
                    className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 text-sm"
                  >
                    {addTaskForm}

                    <DrawerFooter className="px-0 pt-2">
                      <Button type="submit" disabled={isAddingTask}>
                        {isAddingTask ? "Creating..." : "Create Task"}
                      </Button>
                      <DrawerClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isAddingTask}
                        >
                          Cancel
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog
                open={isAddTaskOpen}
                onOpenChange={(open) => {
                  if (isAddingTask) return;
                  setIsAddTaskOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">Add Task</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-170 rounded-2xl border bg-background p-0 shadow-2xl">
                  <DialogHeader className="px-6 pt-6 pb-2 text-left">
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a task, assign it to a member and set its priority.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={handleAddTask}
                    className="space-y-4 px-6 pb-6 text-sm"
                  >
                    {addTaskForm}

                    <DialogFooter className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isAddingTask}
                        onClick={() => setIsAddTaskOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isAddingTask}>
                        {isAddingTask ? "Creating..." : "Create Task"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ))}
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="relative md:hidden">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              setRowSelection({});
            }}
            placeholder="Search tasks..."
            className="h-9 pl-8"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border lg:overflow-x-hidden">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className="min-w-275 table-fixed lg:w-full lg:min-w-0 lg:table-auto">
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          "h-12 whitespace-nowrap px-4 align-middle",
                          header.column.columnDef.meta?.headerClassName,
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No tasks found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} task(s) selected.
          </div>

          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>

              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>

                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>

              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>

              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>

              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
});

function TableCellViewer({
  item,
  onSaveTask,
  members = [],
  canManageTasks = false,
  isMember = false,
  currentUserId = "",
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const canMemberUpdateStatus =
    isMember && String(item.assignedToId) === String(currentUserId);
  const canEditFullTask = canManageTasks;
  const canUpdateOnlyStatus = canMemberUpdateStatus && !canManageTasks;

  const [formData, setFormData] = React.useState({
    header: item.header,
    description: item.description || "",
    type: item.type,
    status: item.status,
    target: item.target,
    limit: item.limit,
    reviewer: item.reviewer,
    assignedToId: item.assignedToId || "",
  });

  React.useEffect(() => {
    setFormData({
      header: item.header,
      description: item.description || "",
      type: item.type,
      status: item.status,
      target: item.target,
      limit: item.limit,
      reviewer: item.reviewer,
      assignedToId: item.assignedToId || "",
    });
  }, [item]);

  function handleFormFieldChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFormAssigneeChange(value) {
    setFormData((prev) => ({ ...prev, ...resolveAssignee(members, value) }));
  }

  function handleSaveChanges(e) {
    e.preventDefault();

    const taskTitle = formData.header.trim();

    if (!taskTitle) {
      notify.error("Task title is required");
      return;
    }

    if (canUpdateOnlyStatus) {
      onSaveTask?.(item.id, { status: formData.status });
      setOpen(false);
      return;
    }

    onSaveTask?.(item.id, { ...formData, header: taskTitle });
    setOpen(false);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <button
          type="button"
          className="group flex w-full min-w-0 items-center text-left outline-none"
          title={`${item.header} - Click to view details`}
        >
          <span className="relative block min-w-0 truncate rounded-sm py-1 pr-2 text-sm font-medium text-foreground/85 underline-offset-4 transition-all duration-150 group-hover:translate-x-0.5 group-hover:underline group-hover:decoration-dotted group-hover:decoration-foreground/50 group-focus-visible:underline group-focus-visible:decoration-dotted">
            {item.header}
          </span>
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{formData.header}</DrawerTitle>
          <DrawerDescription>
            View and update task details, assignment, status and priority.
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSaveChanges}
          className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
        >
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">{formData.status}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{formData.type}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-medium">
                  {formatDeadline(formData.target)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Priority</span>
                <span className="font-medium">{formData.limit}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Assigned To</span>
                <span className="font-medium">
                  {formData.reviewer === "Assign reviewer"
                    ? "Unassigned"
                    : formData.reviewer}
                </span>
              </div>
            </div>
          </div>

          <TaskFormFields
            idPrefix={String(item.id)}
            values={formData}
            onFieldChange={handleFormFieldChange}
            onAssigneeChange={handleFormAssigneeChange}
            members={members}
            disabled={{
              header: !canEditFullTask,
              description: !canEditFullTask,
              type: !canEditFullTask,
              status: !canEditFullTask && !canUpdateOnlyStatus,
              limit: !canEditFullTask,
              assignedToId: !canEditFullTask,
            }}
          />

          <DrawerFooter className="px-0">
            {(canEditFullTask || canUpdateOnlyStatus) && (
              <Button type="submit">Save changes</Button>
            )}
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
