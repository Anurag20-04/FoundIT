export async function getItemById(id) {
  const res = await fetch(`/api/items/${id}`);
  return res.json();
}
