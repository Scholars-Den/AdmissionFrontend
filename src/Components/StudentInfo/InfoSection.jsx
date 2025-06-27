const InfoSection = ({ title, data }) => (
  <section className="mb-6">
    <h3 className="mb-2 text-lg font-semibold text-gray-700">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
      {data.map(([label, value]) => (
        <p key={label}>
          <strong>{label}:</strong> {value || "—"}
        </p>
      ))}
    </div>
  </section>
);

export default InfoSection;
