import apiClient from './client';

export async function pingBackend() {
  try {
    const res = await apiClient.get('/');
    console.log("✅ Backend alive:", res.data);
  } catch (err) {
    console.error("❌ Backend NOT reachable:", err);
  }
}
