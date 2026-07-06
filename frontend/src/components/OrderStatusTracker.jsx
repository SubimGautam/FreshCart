import { Fragment } from 'react';
import { ShoppingBag, CheckCircle2, PackageSearch, Truck, PackageCheck, XCircle } from 'lucide-react';

const buildStages = (fulfillmentMethod) => [
  { key: 'pending', label: 'Order placed', icon: ShoppingBag },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: PackageSearch },
  { key: 'out_for_delivery', label: fulfillmentMethod === 'pickup' ? 'Ready for pickup' : 'Out for delivery', icon: Truck },
  { key: 'delivered', label: fulfillmentMethod === 'pickup' ? 'Picked up' : 'Delivered', icon: PackageCheck },
];

const OrderStatusTracker = ({ status, fulfillmentMethod = 'delivery' }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-deal-50 border border-deal-200 rounded-xl px-4 py-3.5">
        <XCircle className="w-5 h-5 text-deal-600 flex-shrink-0" strokeWidth={1.75} />
        <div>
          <p className="text-sm font-semibold text-deal-700">Order cancelled</p>
          <p className="text-xs text-deal-600/80">This order will not be processed further.</p>
        </div>
      </div>
    );
  }

  const stages = buildStages(fulfillmentMethod);
  const currentIndex = stages.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {stages.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const Icon = stage.icon;
        return (
          <Fragment key={stage.key}>
            {i > 0 && (
              <div className={`flex-1 h-0.5 mt-4 ${i <= currentIndex ? 'bg-primary-500' : 'bg-stone-200'}`} />
            )}
            <div className="flex flex-col items-center text-center w-14 sm:w-20 flex-shrink-0">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                  done || active
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-stone-200 text-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </span>
              <span className={`text-[10px] sm:text-[11px] mt-2 font-medium leading-tight ${active ? 'text-ink' : done ? 'text-primary-600' : 'text-ink/35'}`}>
                {stage.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
