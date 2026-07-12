function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 animate-pulse">
      <div className="h-5 bg-slate-700 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-slate-700 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-slate-700 rounded w-2/3"></div>
    </div>
  );
}

export default SkeletonCard;