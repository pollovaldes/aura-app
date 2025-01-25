export const getRoleLabel = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "DRIVER":
      return "Conductor";
    case "BANNED":
      return "Bloqueado";
    case "NO_ROLE":
      return "Sin rol";
    case "OWNER":
      return "Dueño";
    default:
      return "Indefinido";
  }
};
