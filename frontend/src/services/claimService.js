export async function submitClaim(data) {
  const token = localStorage.getItem("auth_token");

  // return fetch("http://localhost:5000/api/claims", {
  return fetch(`${import.meta.env.VITE_API_URL}/api/claims`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
