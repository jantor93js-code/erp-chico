import React, { useRef } from 'react';

export default function ImportDropzone({ onAnalyze }: { onAnalyze: (contract: unknown) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '');
        const parsed = JSON.parse(text);
        onAnalyze(parsed);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error parsing JSON file', err);
        alert('El archivo no contiene un JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">Arrastra o pega aquí tu contrato JSON</p>
          <p className="text-xs text-slate-400 mt-1">Se enviará al backend para su análisis.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            onClick={handleClick}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Analizar contrato
          </button>
        </div>
      </div>
    </div>
  );
}
