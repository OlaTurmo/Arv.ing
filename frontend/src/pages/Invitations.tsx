import { useEffect } from "react";
import { useUserGuardContext } from "app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useInvitationsStore } from "utils/invitationsStore";
import { Role } from "types";

const Invitations = () => {
  const { user } = useUserGuardContext();
  const { invitations, loading, loadInvitations, acceptInvitation } = useInvitationsStore();

  // Load invitations by checking all estates
  useEffect(() => {
    loadInvitations(user.email);
  }, [user.email, loadInvitations]);

  const handleAcceptInvite = async (estateId: string) => {
    try {
      await acceptInvitation(estateId, user.email);
      toast.success("Invitation accepted successfully");
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Invitations</h1>
      {loading ? (
        <p>Loading invitations...</p>
      ) : invitations.length === 0 ? (
        <p>No pending invitations</p>
      ) : (
        <div className="grid gap-4">
          {invitations.map((invitation) => (
            <Card key={`${invitation.estate_id}-${invitation.email}`}>
              <CardHeader>
                <CardTitle>Estate Invitation</CardTitle>
                <CardDescription>
                  You have been invited to collaborate on an estate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-semibold">Role</p>
                    <p className="capitalize">{invitation.role}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Invited By</p>
                    <p>{invitation.invited_by}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Invited At</p>
                    <p>
                      {new Date(invitation.invited_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAcceptInvite(invitation.estate_id)}
                    disabled={loading}
                  >
                    Accept Invitation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invitations;
