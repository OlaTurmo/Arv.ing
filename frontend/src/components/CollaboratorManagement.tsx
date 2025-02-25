import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useUserGuardContext } from "app";
import brain from "brain";
import { toast } from "sonner";

interface Props {
  estateId: string;
  onInvited?: () => void;
}

export function CollaboratorManagement({ estateId, onInvited }: Props) {
  const { user } = useUserGuardContext();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  // Load existing roles
  const loadRoles = async () => {
    try {
      const response = await brain.get_roles({ estate_id: estateId });
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
      toast.error("Kunne ikke laste inn samarbeidspartnere");
    }
  };

  // Invite collaborator
  const handleInvite = async () => {
    if (!email) {
      toast.error("Vennligst skriv inn en e-postadresse");
      return;
    }

    setLoading(true);
    try {
      const response = await brain.invite_collaborator({
        estate_id: estateId,
        email,
        role,
      });
      const data = await response.json();
      toast.success("Invitasjon sendt");
      setEmail("");
      loadRoles();
      onInvited?.();
    } catch (error) {
      console.error("Failed to invite:", error);
      toast.error("Kunne ikke sende invitasjon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Inviter samarbeidspartner</h3>
        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="E-postadresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Velg rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Lesetilgang</SelectItem>
                <SelectItem value="editor">Rediger</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleInvite}
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? "Sender invitasjon..." : "Send invitasjon"}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Samarbeidspartnere</h3>
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.email}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">{role.email}</p>
                <p className="text-sm text-gray-500">
                  {role.role === "viewer"
                    ? "Lesetilgang"
                    : role.role === "editor"
                    ? "Rediger"
                    : "Administrator"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {role.status === "pending" ? "Venter på godkjenning" : "Aktiv"}
              </div>
            </div>
          ))}
          {roles.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Ingen samarbeidspartnere enda
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
