export async function fetchDashboardData() {
  const res = await fetch("/api/trends/daily");

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await res.json();

  // API returns latest first
  return data[0];
}
export async function fetchDashboardTrends() {
  const res = await fetch("/api/trends/daily");

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard trends");
  }

  return res.json(); // 👈 full array
}
