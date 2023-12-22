export const constants = {
  NX_API_BASE_URL:
    process.env['NODE_ENV'] === 'production'
      ? 'https://be.squoolr.com'
      : 'http://localhost:8080',
  NX_CRYPTJS_SECRET: 'I_hate_trash',
};
