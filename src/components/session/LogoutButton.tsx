import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./context/useAuthContext"; 
import { useRouter } from "next/navigation";
import { SESSION_COOKIE } from "@/const/constants";
import AlertDialog from "@/components/ui/AlertDialog";

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
    <AlertDialog
      message="Tu sesión se cerrará y tendrás que volver a iniciar sesión para acceder al dashboard."
      confirmButtonProps={{
        children: signOutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión",
        disabled: signOutMutation.isPending,
      }}
      cancelButtonProps={{ children: "Cancelar" }}
    >
      <button
        className={`${containerClass || ""}`}
        title="Cerrar sesión"
        type="button"
        aria-label="Logout"
        onClick={() => signOutMutation.mutate()}
      >
        {icon}
        <span className={`${contentClass || ""}`}>
          LogOut
        </span>
      </button>
    </AlertDialog>
  );
}

export default LogoutButton;
