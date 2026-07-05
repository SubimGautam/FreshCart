const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden flex flex-col animate-pulse">
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-3 w-full bg-gray-200 rounded-full" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 w-14 bg-gray-200 rounded-full" />
          <div className="h-9 w-20 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
