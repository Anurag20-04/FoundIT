import { useState } from "react";
import { submitClaim } from "../services/claimService";

export default function ClaimModal({ itemId, onClose }) {
  const [proof, setProof] = useState("");

  const handleSubmit = async () => {
    await submitClaim({
      itemId,
      proof,
    });
    onClose();
    alert("Request sent for verification.");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Verify Ownership</h3>

        <textarea
          placeholder="Describe a unique detail only the owner would know"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Submit Request
        </button>

        <button className="secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
