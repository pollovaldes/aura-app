export const formatDate = (dateString: string, prefix: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("es", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${prefix}${day} de ${month} del ${year} a las ${hours}:${minutes} horas`;
};
