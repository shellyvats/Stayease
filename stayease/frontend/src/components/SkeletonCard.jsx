// Skeleton placeholder mirroring the PropertyCard layout, used while data loads.
const SkeletonCard = () => (
  <div className="card flex flex-col overflow-hidden">
    <div className="skeleton h-44 w-full rounded-none" />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
      </div>
      <div className="skeleton mt-2 h-5 w-1/3" />
    </div>
  </div>
);

export default SkeletonCard;
