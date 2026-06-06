export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
