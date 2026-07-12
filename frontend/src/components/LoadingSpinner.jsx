function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;