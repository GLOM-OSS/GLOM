export const constants = {
  // ? 'https://api.squoolr.com'
  NX_API_BASE_URL:
    process.env['NODE_ENV'] === 'production'
      ? 'https://localhost:83'
      : 'http://localhost:8000',
  NX_CRYPTJS_SECRET: 'I_hate_trash',
};
