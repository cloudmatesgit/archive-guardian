export async function fetchDashboardData() {
  const res = await fetch("http://localhost:8000/trends/daily");

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await res.json();

  // API returns latest first
  return data[0];
}
