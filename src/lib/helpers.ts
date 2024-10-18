export function formatDate(
  date: Date | string,
  locale: string = "en-US"
): string {
  const dateObject = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObject.getTime())) {
    throw new Error("Invalid date");
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    // timeZoneName: "short",
  }).format(dateObject);
}
