// api/auth.js

export const checkAuthStatus = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/check', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('인증되지 않음');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
