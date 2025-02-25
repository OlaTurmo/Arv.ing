import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useUserGuardContext } from "app";
import brain from "brain";
import { toast } from "sonner";

interface Props {
  estateId: string;
  taskId?: string;
}

export function CommentSection({ estateId, taskId }: Props) {
  const { user } = useUserGuardContext();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load comments
  const loadComments = async () => {
    try {
      const response = await brain.get_comments({
        estate_id: estateId,
        task_id: taskId,
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
      toast.error("Kunne ikke laste inn kommentarer");
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Vennligst skriv en kommentar");
      return;
    }

    setLoading(true);
    try {
      const response = await brain.add_comment(
        { estate_id: estateId },
        {
          id: "", // Will be set by backend
          estate_id: estateId,
          task_id: taskId,
          user_id: user.uid,
          content: comment.trim(),
          created_at: new Date().toISOString(),
        }
      );
      const data = await response.json();
      setComment("");
      loadComments();
      toast.success("Kommentar lagt til");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Kunne ikke legge til kommentar");
    } finally {
      setLoading(false);
    }
  };

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [estateId, taskId]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Kommentarer</h3>
      
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 p-3 rounded"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">{comment.user_id}</p>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString("nb-NO")}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Ingen kommentarer enda
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Skriv en kommentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          disabled={loading || !comment.trim()}
          className="w-full"
        >
          {loading ? "Legger til..." : "Legg til kommentar"}
        </Button>
      </div>
    </Card>
  );
}
