type ExecutiveRecommendationsProps = {
  recommendations: string[];
};

export default function ExecutiveRecommendations({ recommendations }: ExecutiveRecommendationsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Recomendaciones</p>
          <p className="text-sm text-slate-500">Sugerencias simples basadas en la situación actual.</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <div key={recommendation} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {recommendation}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No hay recomendaciones urgentes.
          </div>
        )}
      </div>
    </section>
  );
}
