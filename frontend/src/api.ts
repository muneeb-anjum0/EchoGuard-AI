export type PredictionResult = {
  filename?: string;
  duration_sec?: number;
  audio_type?: "speech" | "environmental" | string;
  speech_ratio?: number;
  selected_model?: "speech_wavlm" | "environmental_ast" | string;
  prediction?: "real" | "fake" | string;
  confidence?: number;
  real_prob?: number;
  fake_prob?: number;
  threshold_used?: number;
  explanation?: string;
  note?: string;
  spectrogram_png?: string | null;
  spectrogram_base64?: string | null;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function predictAudio(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Backend is not reachable. Start the FastAPI server on port 8000.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? "Analysis failed. Try another audio file or check the backend logs.");
  }

  return response.json();
}
