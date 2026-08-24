import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./context/useAuthContext"; 
import { useRouter } from "next/navigation";
import { SESSION_COOKIE } from "@/const/constants";

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
      title="Cerrar sesión"
      type="button"
      aria-label="Logout"
      onClick={() => signOutMutation.mutate(SESSION_COOKIE)}
    >
      {icon}
      <span className={`${contentClass || ""}`}>
        LogOut
      </span>
    </button>
  );
}

export default LogoutButton;