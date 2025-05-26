import { useEffect, useState } from "react";

const StepsBar = ({ currentStep, setCurrentStep, getListOds }) => {
  const steps = [
    { label: 'CART' },
    { label: 'YOUR ORDERS' },
  ];

  useEffect(() => {
    getListOds();
  }, [currentStep])
  return (
    <div className="flex items-center justify-center gap-4 py-8 bg-gray-50 px-4 md:px-8 border-b">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === currentStep;

        return (
          <div key={idx} className="flex items-center gap-5" onClick={() => setCurrentStep(idx + 1)}>
            {/* Circle Step Number */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-semibold
                  ${isActive ? 'bg-[#fecb02] text-white' : 'border border-gray-300 text-gray-400'}
                `}
            >
              {stepNumber}
            </div>
            {/* Step label */}
            <span className={`uppercase text-xl font-semibold ${isActive ? 'text-[#fecb02]' : 'text-gray-400'}`}
            >
              {step.label}
            </span>

            {/* Separator line (if not last) */}
            {idx !== steps.length - 1 && (
              <div className="w-20 h-px bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepsBar;
