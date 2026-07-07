import React from 'react';

export default function ImportPipeline({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= activeIndex ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {i + 1}
            </div>
            <div className="text-sm">
              <div className={`${i <= activeIndex ? 'text-slate-800' : 'text-slate-400'}`}>{step}</div>
            </div>
            {i < steps.length - 1 && <div className={`w-10 h-0.5 ${i < activeIndex ? 'bg-sky-600' : 'bg-slate-200'} mx-3`} />}
          </div>
        ))}
      </div>
    </div>
  );
}
