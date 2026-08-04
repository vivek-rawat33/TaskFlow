import { useState, useEffect } from "react";
import { updateTeam, deleteTeam } from "@/api/teamApi";
import { notify } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeamSettingsSection({
  teamId,
  currentTeam,
  currentUserRole = "",
  onTeamUpdated,
  onTeamDeleted,
}) {
  const [teamForm, setTeamForm] = useState({
    name: currentTeam?.name || "",
    description: currentTeam?.description || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canUpdateTeam =
    currentUserRole === "owner" || currentUserRole === "admin";

  const canDeleteTeam = currentUserRole === "owner";

  useEffect(() => {
    setTeamForm({
      name: currentTeam?.name || "",
      description: currentTeam?.description || "",
    });
  }, [currentTeam]);

  async function handleUpdateTeam(e) {
    e.preventDefault();

    const name = teamForm.name.trim();
    const description = teamForm.description.trim();

    if (!name) {
      notify.error("Team name is required");
      return;
    }

    try {
      setIsSaving(true);

      const res = await updateTeam(teamId, {
        name,
        description,
      });

      onTeamUpdated?.(res.team);

      notify.success("Team updated successfully");
    } catch (error) {
      console.error("Update team failed:", error);
      notify.error(error.response?.data?.message || "Failed to update team");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTeam() {
    const confirmed = window.confirm(
      "Delete this team permanently? This will delete all tasks and members from this team.",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteTeam(teamId);

      notify.success("Team deleted successfully");

      onTeamDeleted?.();
    } catch (error) {
      console.error("Delete team failed:", error);
      notify.error(error.response?.data?.message || "Failed to delete team");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="border-b px-5 py-5">
          <h2 className="text-xl font-semibold tracking-tight">
            Team Settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update team details and manage dangerous actions.
          </p>
        </div>

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleUpdateTeam} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamForm.name}
                disabled={!canUpdateTeam}
                onChange={(e) =>
                  setTeamForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Example: Product Team"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teamDescription">Description</Label>
              <textarea
                id="teamDescription"
                value={teamForm.description}
                disabled={!canUpdateTeam}
                onChange={(e) =>
                  setTeamForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe this team..."
                rows={5}
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {canUpdateTeam ? (
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                You do not have permission to edit this team.
              </p>
            )}
          </form>

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Deleting a team permanently removes its tasks, members, and team
              data.
            </p>

            <Button
              type="button"
              variant="destructive"
              className="mt-4"
              disabled={!canDeleteTeam || isDeleting}
              onClick={handleDeleteTeam}
            >
              {isDeleting ? "Deleting..." : "Delete Team"}
            </Button>

            {!canDeleteTeam && (
              <p className="mt-2 text-xs text-muted-foreground">
                Only the team owner can delete this team.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
