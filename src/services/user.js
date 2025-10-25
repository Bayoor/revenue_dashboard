
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getUser = async () => {
  const response = await fetch(`${BASE_URL}/user`);
  if(!response.ok) {
    throw new Error('Failed to fetch user');
  }
  const data = await response.json();
  return data;
};

export const getAllTransactions = async () => {
  const response = await fetch(`${BASE_URL}/transactions`);
  if(!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const data = await response.json();
  return data;
};

export const getWallet = async () => {
  const response = await fetch(`${BASE_URL}/wallet`);
  if(!response.ok) {
    throw new Error('Failed to fetch wallet');
  }
  const data = await response.json();
  return data;
};

