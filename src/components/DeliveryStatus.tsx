import React from 'react';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react';

interface DeliveryStatusProps {
  status: string;
  startTime?: Date;
  endTime?: Date;
}

export default function DeliveryStatus({ status, startTime, endTime }: DeliveryStatusProps) {
  const steps = [
    { key: 'pending', label: 'Solicitado', icon: Package },
    { key: 'accepted', label: 'Aceptado', icon: CheckCircle },
    { key: 'pickup', label: 'Recogido', icon: MapPin },
    { key: 'transit', label: 'En tránsito', icon: Truck },
    { key: 'delivered', label: 'Entregado', icon: CheckCircle },
  ];

  const currentStep = steps.findIndex(step => step.key === status);

  return (
    <div className="py-4">
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
          />
        </div>
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center ${
                  index === 0 ? 'items-start' : index === steps.length - 1 ? 'items-end' : ''
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {(index === 0 && startTime) || (index === steps.length - 1 && endTime) ? (
                  <span className="text-xs text-gray-500 mt-1">
                    {(index === 0 ? startTime : endTime)?.toLocaleTimeString()}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}