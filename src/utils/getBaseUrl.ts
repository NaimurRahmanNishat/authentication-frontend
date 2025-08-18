const getBaseUrl = () => {
  return typeof window !== 'undefined' ? 'http://localhost:5000' : 'http://localhost:5000';
};

export { getBaseUrl };