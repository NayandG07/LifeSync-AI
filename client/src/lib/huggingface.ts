const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

export async function analyzeSymptoms(symptoms: string[]): Promise<string[]> {
  const response = await fetch(HUGGINGFACE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: symptoms.join(", "),
      parameters: {
        candidate_labels: [
          "respiratory infection",
          "digestive issue",
          "cardiovascular condition",
          "musculoskeletal pain",
          "neurological condition",
          "allergic reaction",
        ],
      },
    }),
  });

  const data = await response.json();
  return data.labels.slice(0, 3);
}
