export function formatCurrency(amount, currency = "CBDC") {
  const value = Number(amount || 0);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${currency}`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortenHash(hash, chars = 6) {
  if (!hash) return "—";
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function statusColor(status) {
  switch ((status || "").toLowerCase()) {
    case "completed":
    case "approved":
    case "verified":
    case "success":
      return "bg-green-100 text-green-700";
    case "pending":
    case "processing":
    case "submitted":
      return "bg-amber-100 text-amber-700";
    case "failed":
    case "rejected":
    case "declined":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}
