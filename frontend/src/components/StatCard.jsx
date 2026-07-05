const colorMap = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  deal: 'bg-deal-50 text-deal-600 border-deal-200',
  flash: 'bg-flash-300/30 text-flash-600 border-flash-400',
  ink: 'bg-gray-100 text-ink border-gray-200',
};

const StatCard = ({ icon, label, value, color = 'primary' }) => {
  return (
    <div className={`rounded-2xl border-2 p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-2xl font-display font-extrabold mt-3">{value}</p>
      <p className="text-sm font-medium opacity-70">{label}</p>
    </div>
  );
};

export default StatCard;
