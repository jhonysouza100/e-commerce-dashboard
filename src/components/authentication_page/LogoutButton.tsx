import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./context/useAuthContext"; 
import { useRouter } from "next/navigation";

function LogoutButton({
  contentClass,
  containerClass,
  icon,
}: {
  containerClass?: string;
  contentClass?: string;
  icon?: React.ReactNode;
}) {
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
      className={`${containerClass || ""}`}
      type="button"
      aria-label="Logout"
      onClick={() => signOutMutation.mutate("user-token")}
    >
      {icon}
      <span className={`${contentClass || ""}`}>
        Logout
      </span>
    </button>
  );
}

export default LogoutButton;