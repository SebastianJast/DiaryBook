const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function getList(id, token) {
  return fetch(`${API_BASE_URL}/all/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  }).then((data) => data.json());
}

export function addItem(item, id, token) {
  return fetch(`http://localhost:3000/notes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title: item.title, content: item.content }),
  }).then((data) => data.json());
}

export function deleteItem(id, token) {
  console.log(id);
  return fetch(`http://localhost:3000/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  }).then((data) => data.json());
}

export function editItem(id, title, content, token) {
  console.log(id);
  return fetch(`http://localhost:3000/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title: title, content: content }),
  }).then((data) => data.json());
}

export async function loginUser(credentials) {
  console.log(credentials);
  return fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export async function addUser(credentials) {
  return fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}
