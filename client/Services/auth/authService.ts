// Call the registration API

import { AuthContext } from "@/hooks/auth/AuthProvider";

const url = 'http://localhost:4200';
export async function register(userData:{email:string, password:string,username:string}) {
  const response = await fetch(url+'/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Call the login API
export async function login(username:string, password:string) {
  const response = await fetch(url+'/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

