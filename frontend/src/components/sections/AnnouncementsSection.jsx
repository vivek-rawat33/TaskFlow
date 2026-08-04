import { useState, useEffect } from "react";
import { getTeamAnnouncements, createTeamAnnouncement, deleteTeamAnnouncement } from "@/api/announcementApi";
import { notify } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AnnouncementsSection({ teamId, currentUserRole = "" }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const canManageAnnouncements =
    currentUserRole === "owner" || currentUserRole === "admin";

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!teamId) return;

      try {
        setLoading(true);

        const res = await getTeamAnnouncements(teamId);
        setAnnouncements(res.announcements || []);
      } catch (error) {
        console.error("Fetch announcements failed:", error);
        notify.error(
          error.response?.data?.message || "Failed to fetch announcements",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, [teamId]);

  async function handleCreateAnnouncement(e) {
    e.preventDefault();

    const title = announcementForm.title.trim();
    const message = announcementForm.message.trim();

    if (!title) {
      notify.error("Announcement title is required");
      return;
    }

    if (!message) {
      notify.error("Announcement message is required");
      return;
    }

    try {
      setIsCreating(true);

      const res = await createTeamAnnouncement(teamId, {
        title,
        message,
      });

      setAnnouncements((prev) => [res.announcement, ...prev]);

      setAnnouncementForm({
        title: "",
        message: "",
      });

      setIsCreateOpen(false);

      notify.success("Announcement posted successfully");
    } catch (error) {
      console.error("Create announcement failed:", error);
      notify.error(
        error.response?.data?.message || "Failed to create announcement",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteAnnouncement(announcementId) {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;

    try {
      await deleteTeamAnnouncement(teamId, announcementId);

      setAnnouncements((prev) =>
        prev.filter(
          (announcement) => String(announcement._id) !== String(announcementId),
        ),
      );

      notify.success("Announcement deleted successfully");
    } catch (error) {
      console.error("Delete announcement failed:", error);
      notify.error(
        error.response?.data?.message || "Failed to delete announcement",
      );
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Announcements
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share important updates with your team.
            </p>
          </div>

          {canManageAnnouncements && (
            <Button onClick={() => setIsCreateOpen(true)}>
              Create Announcement
            </Button>
          )}
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No announcements yet.
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement._id} className="px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold tracking-tight">
                      {announcement.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {announcement.message}
                    </p>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Posted by {announcement.createdBy?.name || "Unknown user"}{" "}
                      ·{" "}
                      {new Date(announcement.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  {canManageAnnouncements && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create announcement</DialogTitle>
            <DialogDescription>
              Post an update that all team members can read.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="announcementTitle">Title</Label>
              <Input
                id="announcementTitle"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Example: Sprint planning update"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="announcementMessage">Message</Label>
              <textarea
                id="announcementMessage"
                value={announcementForm.message}
                onChange={(e) =>
                  setAnnouncementForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder="Write your announcement..."
                rows={5}
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
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
                {isCreating ? "Posting..." : "Post Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
