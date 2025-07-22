export const loadConfig = async () => {
  const response = await fetch('/config.json');
  const config = await response.json();

  if (config.apiEndpoint) {
    localStorage.setItem('API_ENDPOINT', config.apiEndpoint);
  }

  return config;
};
