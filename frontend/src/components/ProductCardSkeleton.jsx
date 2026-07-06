const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col animate-pulse">
      <div className="h-56 bg-stone-100" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-2.5 w-16 bg-stone-100 rounded-full" />
        <div className="h-2.5 w-20 bg-stone-100 rounded-full" />
        <div className="flex items-start justify-between gap-3">
          <div className="h-4 w-2/3 bg-stone-100 rounded-full" />
          <div className="h-4 w-10 bg-stone-100 rounded-full" />
        </div>
        <div className="h-3 w-full bg-stone-100 rounded-full" />
        <div className="h-9 w-full bg-stone-100 rounded-full mt-2" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
