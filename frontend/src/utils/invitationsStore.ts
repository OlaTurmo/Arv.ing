import { create } from "zustand";
import brain from "brain";
import { Role } from "types";

interface InvitationsStore {
  invitations: Role[];
  loading: boolean;
  loadInvitations: (userEmail: string) => Promise<void>;
  acceptInvitation: (estateId: string, userEmail: string) => Promise<void>;
}

export const useInvitationsStore = create<InvitationsStore>((set, get) => ({
  invitations: [],
  loading: false,

  loadInvitations: async (userEmail: string) => {
    try {
      set({ loading: true });
      const response = await brain.list_estates();
      const estates = await response.json();

      // For each estate, check if there are any pending invitations for this user's email
      const allInvitations: Role[] = [];
      for (const estate of estates) {
        const rolesResponse = await brain.get_roles({ estateId: estate.id });
        const roles = await rolesResponse.json();
        const pendingInvites = roles.filter(
          (role) => role.email === userEmail && role.status === "pending"
        );
        allInvitations.push(...pendingInvites);
      }

      set({ invitations: allInvitations });
    } catch (error) {
      console.error("Failed to load invitations:", error);
    } finally {
      set({ loading: false });
    }
  },

  acceptInvitation: async (estateId: string, userEmail: string) => {
    try {
      set({ loading: true });
      const response = await brain.accept_invite({
        estateId,
        email: userEmail,
      });
      await response.json();

      // Remove the accepted invitation from the list
      const currentInvitations = get().invitations;
      set({
        invitations: currentInvitations.filter(
          (inv) => inv.estate_id !== estateId
        ),
      });
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
