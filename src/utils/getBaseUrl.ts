const getBaseUrl = () => {
  return typeof window !== 'undefined' ? 'https://authentication-backend-alpha.vercel.app' : 'https://authentication-backend-alpha.vercel.app';
};

export { getBaseUrl };