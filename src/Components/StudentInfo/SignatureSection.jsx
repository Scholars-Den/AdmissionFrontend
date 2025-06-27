const SignatureSection = ({ signatures }) => (
  <section>
    <h3 className="mb-2 text-lg font-semibold text-gray-700">Signatures</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
      <div>
        <strong>Parent Signature:</strong>
        <br />
        {signatures?.parent ? (
          <img
            src={signatures.parent}
            alt="Parent Signature"
            className="mt-1 border rounded max-h-32"
          />
        ) : (
          <p className="text-gray-500">Not available</p>
        )}
      </div>

      <div>
        <strong>Student Signature:</strong>
        <br />
        {signatures?.student ? (
          <img
            src={signatures.student}
            alt="Student Signature"
            className="mt-1 border rounded max-h-32"
          />
        ) : (
          <p className="text-gray-500">Not available</p>
        )}
      </div>
    </div>
  </section>
);

export default SignatureSection;
