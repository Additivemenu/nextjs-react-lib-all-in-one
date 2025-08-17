import { Button } from "@/components/ui/button";

interface DemoControlsProps {
  currentUserId: number;
  onUserChange: (userId: number) => void;
  onRefresh: () => void;
}

export function DemoControls({
  currentUserId,
  onUserChange,
  onRefresh,
}: DemoControlsProps) {
  const users = [1, 2, 3];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Demo Controls</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-sm font-medium self-center">User:</span>
          {users.map((userId) => (
            <Button
              key={userId}
              onClick={() => onUserChange(userId)}
              variant={currentUserId === userId ? "default" : "outline"}
              size="sm"
            >
              User {userId}
            </Button>
          ))}
        </div>
        <Button onClick={onRefresh} variant="secondary" size="sm">
          🔄 Refresh All
        </Button>
      </div>
    </div>
  );
}
