import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    success: "bg-gradient-to-br from-green-100 to-green-50 text-green-700", 
    warning: "bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-700",
    secondary: "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-700"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          {trend && (
            <div className="flex items-center">
              <Icon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={trend === 'up' ? 'text-green-600' : 'text-red-600'} 
              />
              <span className={`text-sm ml-1 font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses?.[color]}`}>
          <Icon name={icon} size={28} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;