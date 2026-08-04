import { useState, useEffect } from "react";
import { getTeamMeetings, createTeamMeeting, deleteTeamMeeting } from "@/api/meetingApi";
import { notify } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, VideoIcon, ClockIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function MeetingsSection({ teamId, currentUserRole = "" }) {
  const [meetings, setMeetings] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    meetingUrl: "",
  });

  const canManageMeetings =
    currentUserRole === "owner" || currentUserRole === "admin";

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    let cancelled = false;

    async function fetchMeetings() {
      if (!teamId) return;

      try {
        const res = await getTeamMeetings(teamId, monthStr);
        if (!cancelled) {
          setMeetings(res.meetings || []);
          setInitialLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fetch meetings failed:", error);
          notify.error(
            error.response?.data?.message || "Failed to fetch meetings",
          );
          setInitialLoading(false);
        }
      }
    }

    fetchMeetings();
    return () => {
      cancelled = true;
    };
  }, [teamId, monthStr]);

  function goToPrevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  function goToNextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  function goToToday() {
    setCurrentMonth(new Date());
    setSelectedDate(null);
  }

  // Calendar grid helpers
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Build the 6-row calendar grid
  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: null,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      date: dateStr,
    });
  }

  // Next month leading days to fill the grid
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: null,
    });
  }

  // Get meetings for a given date string
  function getMeetingsForDate(dateStr) {
    if (!dateStr) return [];
    return meetings.filter((m) => {
      const mDate = new Date(m.date);
      const mStr = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, "0")}-${String(mDate.getDate()).padStart(2, "0")}`;
      return mStr === dateStr;
    });
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function handleDayClick(dayObj) {
    if (!dayObj.isCurrentMonth || !dayObj.date) return;

    if (selectedDate === dayObj.date) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(dayObj.date);

    if (canManageMeetings) {
      setMeetingForm((prev) => ({
        ...prev,
        date: dayObj.date,
      }));
    }
  }

  function openCreateDialog(dateStr) {
    setMeetingForm({
      title: "",
      description: "",
      date: dateStr || "",
      startTime: "",
      endTime: "",
      meetingUrl: "",
    });
    setIsCreateOpen(true);
  }

  async function handleCreateMeeting(e) {
    e.preventDefault();

    const title = meetingForm.title.trim();
    if (!title) {
      notify.error("Meeting title is required");
      return;
    }

    if (!meetingForm.date) {
      notify.error("Meeting date is required");
      return;
    }

    if (!meetingForm.startTime) {
      notify.error("Start time is required");
      return;
    }

    try {
      setIsCreating(true);

      const res = await createTeamMeeting(teamId, {
        title,
        description: meetingForm.description.trim(),
        date: meetingForm.date,
        startTime: meetingForm.startTime,
        endTime: meetingForm.endTime,
        meetingUrl: meetingForm.meetingUrl.trim(),
      });

      setMeetings((prev) =>
        [...prev, res.meeting].sort((a, b) => {
          const dateComp = new Date(a.date) - new Date(b.date);
          if (dateComp !== 0) return dateComp;
          return (a.startTime || "").localeCompare(b.startTime || "");
        }),
      );

      setMeetingForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        meetingUrl: "",
      });

      setIsCreateOpen(false);
      notify.success("Meeting created successfully");
    } catch (error) {
      console.error("Create meeting failed:", error);
      notify.error(error.response?.data?.message || "Failed to create meeting");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteMeeting(meetingId) {
    const confirmed = window.confirm("Delete this meeting?");
    if (!confirmed) return;

    try {
      await deleteTeamMeeting(teamId, meetingId);

      setMeetings((prev) =>
        prev.filter((m) => String(m._id) !== String(meetingId)),
      );

      notify.success("Meeting deleted successfully");
    } catch (error) {
      console.error("Delete meeting failed:", error);
      notify.error(error.response?.data?.message || "Failed to delete meeting");
    }
  }

  const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="px-4 lg:px-6">
      {/* Calendar Card */}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Meetings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule and manage team meetings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>

            {canManageMeetings && (
              <Button
                size="sm"
                onClick={() => openCreateDialog(selectedDate || todayStr)}
                className="gap-1.5"
              >
                <PlusIcon className="size-4" />
                New Meeting
              </Button>
            )}
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevMonth}
            className="size-8 rounded-lg"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <h3 className="text-sm font-semibold tracking-tight">{monthLabel}</h3>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="size-8 rounded-lg"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>

        {initialLoading ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Loading meetings...
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="p-2 sm:p-4">
              {/* Day headers */}
              <div className="mb-1 grid grid-cols-7">
                {dayNames.map((name) => (
                  <div
                    key={name}
                    className="py-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {name}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayObj, idx) => {
                  const dateMeetings = dayObj.date
                    ? getMeetingsForDate(dayObj.date)
                    : [];
                  const isToday = dayObj.date === todayStr;
                  const isSelected = dayObj.date === selectedDate;

                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={dayObj.isCurrentMonth ? 0 : -1}
                      onClick={() => handleDayClick(dayObj)}
                      className={[
                        "relative flex min-h-[4rem] flex-col items-center gap-1 rounded-lg p-1.5 text-sm transition-all duration-150 select-none sm:min-h-[5rem] sm:items-start sm:p-2",
                        "outline-none focus-visible:outline-none",
                        !dayObj.isCurrentMonth
                          ? "pointer-events-none text-muted-foreground/30"
                          : "cursor-pointer hover:bg-muted/50",
                        isSelected && dayObj.isCurrentMonth
                          ? "bg-muted/80 dark:bg-muted/60"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className={[
                          "inline-flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors duration-150",
                          isToday ? "bg-primary text-primary-foreground" : "",
                          isSelected && !isToday && dayObj.isCurrentMonth
                            ? "bg-foreground/10"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {dayObj.day}
                      </span>

                      {dateMeetings.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-[3px] sm:justify-start">
                          {dateMeetings.slice(0, 3).map((_, i) => (
                            <span
                              key={i}
                              className="size-[5px] rounded-full bg-primary/70"
                            />
                          ))}
                          {dateMeetings.length > 3 && (
                            <span className="text-[9px] leading-none text-muted-foreground">
                              +{dateMeetings.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected day panel */}
            {selectedDate && (
              <div className="border-t bg-muted/20 px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold tracking-tight">
                      {selectedDateLabel}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {selectedMeetings.length === 0
                        ? "No meetings scheduled"
                        : `${selectedMeetings.length} meeting${selectedMeetings.length > 1 ? "s" : ""}`}
                    </p>
                  </div>

                  {canManageMeetings && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCreateDialog(selectedDate)}
                      className="gap-1.5"
                    >
                      <PlusIcon className="size-4" />
                      Add Meeting
                    </Button>
                  )}
                </div>

                {selectedMeetings.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {selectedMeetings.map((meeting) => (
                      <div
                        key={meeting._id}
                        className="rounded-xl border bg-card p-4 shadow-xs transition-colors hover:bg-accent/30"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <VideoIcon className="size-3.5 text-primary" />
                              </div>
                              <h4 className="font-semibold tracking-tight">
                                {meeting.title}
                              </h4>
                            </div>

                            <div className="mt-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                              <ClockIcon className="size-3.5" />
                              <span>
                                {formatTime(meeting.startTime)}
                                {meeting.endTime
                                  ? ` – ${formatTime(meeting.endTime)}`
                                  : ""}
                              </span>
                            </div>

                            {meeting.description && (
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {meeting.description}
                              </p>
                            )}

                            {meeting.meetingUrl && (
                              <a
                                href={meeting.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                              >
                                <ExternalLinkIcon className="size-3" />
                                Join Meeting
                              </a>
                            )}

                            <p className="mt-3 text-xs text-muted-foreground/70">
                              Created by{" "}
                              {meeting.createdBy?.name || "Unknown user"}
                            </p>
                          </div>

                          {canManageMeetings && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMeeting(meeting._id)}
                              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2Icon className="size-3.5" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule meeting</DialogTitle>
            <DialogDescription>
              Create a new meeting for your team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="meetingTitle">Title</Label>
              <Input
                id="meetingTitle"
                value={meetingForm.title}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Sprint planning"
              />
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <DatePicker
                value={meetingForm.date}
                onChange={(val) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    date: val,
                  }))
                }
                placeholder="Pick a date"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="meetingStartTime">Start time</Label>
                <Input
                  id="meetingStartTime"
                  type="time"
                  value={meetingForm.startTime}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meetingEndTime">End time</Label>
                <Input
                  id="meetingEndTime"
                  type="time"
                  value={meetingForm.endTime}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetingDescription">Description</Label>
              <textarea
                id="meetingDescription"
                value={meetingForm.description}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of the meeting..."
                rows={3}
                className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetingUrl">Meeting link</Label>
              <Input
                id="meetingUrl"
                type="url"
                value={meetingForm.meetingUrl}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    meetingUrl: e.target.value,
                  }))
                }
                placeholder="https://meet.google.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Google Meet, Zoom, Teams, or any meeting link.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
