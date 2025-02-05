export const getRoleLabel = (role: string) => {
  switch (role) {
    case "OWNER":
      return "Dueño";
    case "DIRECTOR":
      return "Director";
    case "FLEET_MANAGER":
      return "Coordinador de flotilla";
    case "ADMIN":
      return "Administrador";
    case "OPERATOR":
      return "Operador";
    case "NO_ROLE":
      return "Sin rol";
    case "BANNED":
      return "Vetado";
    default:
      return "Indefinido";
  }
};
