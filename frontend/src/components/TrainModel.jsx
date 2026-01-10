import { useState } from "react";
import { trainModel } from "../services/api";

export default function TrainModel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleTrain = async () => {
    if (!file) return alert("Upload CSV first");

    try {
      setLoading(true);
      const res = await trainModel(file);
      setMsg(res.message || "Training completed");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleTrain} disabled={loading}>
        {loading ? "Training..." : "Train CTGAN"}
      </button>

      <p>{msg}</p>
    </div>
  );
}
