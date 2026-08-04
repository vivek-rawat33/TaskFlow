import { useState } from "react";
import { addTeamMember, removeTeamMember, changeMemberRole } from "@/api/teamApi";
import { notify } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlusIcon, Trash2Icon } from "lucide-react";

export default function TeamMembersSection({
  teamId,
  members = [],
  currentUserRole = "",
  onMemberAdded,
  onMemberRemoved,
  onMemberRoleChanged,
}) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({
    email: "",
    role: "member",
  });
  const [addMemberError, setAddMemberError] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const canManageMembers =
    currentUserRole === "owner" || currentUserRole === "admin";

  async function handleAddMember(e) {
    e.preventDefault();

    const email = memberForm.email.trim();

    if (!email) {
      notify.error("Email is required");
      return;
    }

    try {
      setIsAddingMember(true);
      const res = await addTeamMember(teamId, {
        email,
        role: memberForm.role,
      });

      const member = res.member || res.teamMember || res;

      const formattedMember = {
        id: String(
          member.userId?._id || member.userId || member.user?._id || "",
        ),
        name: member.userId?.name || member.user?.name || "Unknown user",
        email: member.userId?.email || member.user?.email || email,
        role: member.role || memberForm.role,
      };

      onMemberAdded?.(formattedMember);

      setMemberForm({
        email: "",
        role: "member",
      });

      setIsAddMemberOpen(false);
      notify.success("Member added successfully");
    } catch (error) {
      console.error("Add member failed:", error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 404) {
        notify.error("User not found. Ask this user to sign up first.");
        return;
      }

      if (status === 409 || message?.toLowerCase().includes("already")) {
        notify.error("This user is already a member of this team.");
        return;
      }

      if (status === 403) {
        notify.error("You do not have permission to add members.");
        return;
      }

      if (status === 401) {
        notify.error("Please sign in again.");
        localStorage.removeItem("token");
        window.location.href = "/signin";
        return;
      }

      notify.error(message || "Failed to add member");
    } finally {
      setIsAddingMember(false);
    }
  }

  async function handleRemoveMember(member) {
    const confirmed = window.confirm(
      `Remove ${member.name || "this member"} from this team?`,
    );

    if (!confirmed) return;

    try {
      await removeTeamMember(teamId, member.id);

      onMemberRemoved?.(member.id);

      notify.success("Member removed successfully");
    } catch (error) {
      console.error("Remove member failed:", error);

      const message = error.response?.data?.message;

      notify.error(message || "Failed to remove member");
    }
  }

  async function handleChangeMemberRole(member, newRole) {
    if (!teamId) {
      notify.error("Team ID missing");
      return;
    }

    if (member.role === "owner") {
      notify.error("Owner role cannot be changed");
      return;
    }

    try {
      await changeMemberRole(teamId, member.id, newRole);

      onMemberRoleChanged?.(member.id, newRole);

      notify.success("Role updated successfully");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to change role");
    }
  }
  
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Team Members
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage team access, member roles, and permissions.
            </p>
          </div>

          {canManageMembers && (
            <Button
              variant="default"
              onClick={() => setIsAddMemberOpen(true)}
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <UserPlusIcon className="size-4" />
              Add Member
            </Button>
          )}
        </div>
        <div className="divide-y">
          {members.length === 0 ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              No members found in this team.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold uppercase text-muted-foreground">
                    {member.name?.charAt(0) || "U"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{member.name}</p>

                      {member.role === "owner" && (
                        <Badge variant="secondary" className="text-xs">
                          Owner
                        </Badge>
                      )}
                    </div>

                    <p className="truncate text-sm text-muted-foreground">
                      {member.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {currentUserRole === "owner" && member.role !== "owner" ? (
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleChangeMemberRole(member, value)
                      }
                    >
                      <SelectTrigger className="h-8 w-32 rounded-full text-xs capitalize">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-1 capitalize"
                    >
                      {member.role}
                    </Badge>
                  )}

                  {canManageMembers && member.role !== "owner" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={isAddMemberOpen}
        onOpenChange={(open) => {
          setIsAddMemberOpen(open);

          if (!open) {
            setAddMemberError("");
            setMemberForm({
              email: "",
              role: "member",
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>
              Add an existing registered user to this team by email.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="memberEmail">Email</Label>

              <Input
                id="memberEmail"
                type="email"
                placeholder="member@example.com"
                value={memberForm.email}
                onChange={(e) => {
                  setMemberForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));

                  if (addMemberError) {
                    setAddMemberError("");
                  }
                }}
                className={addMemberError ? "border-destructive" : ""}
              />

              <p className="text-xs text-muted-foreground">
                The user must already have an account before you can add them.
              </p>

              {addMemberError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {addMemberError}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memberRole">Role</Label>
              <Select
                value={memberForm.role}
                onValueChange={(value) =>
                  setMemberForm((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
              >
                <SelectTrigger id="memberRole" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMemberOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isAddingMember}>
                {isAddingMember ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
