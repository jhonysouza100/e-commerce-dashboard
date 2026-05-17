import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./context/useAuthContext"; 
import { useRouter } from "next/navigation";

function LogoutButton({ className }: { className?: string}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useAuthContext();

  const signOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.refresh();
    },
  });

  return (
    <button
      onClick={() => signOutMutation.mutate("user-token")}>
        <span className={className || ''}>
          Logout
        </span>
    </button>
  );
}

export default LogoutButton;