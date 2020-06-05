const axios = require('axios');

const getUrlData = async (url) => {
  console.log('fetching....');
  // <img height="16" width="16" src='https://icons.duckduckgo.com/ip3/www.google.com.ico' />
  // <img height="16" width="16" src='http://www.google.com/s2/favicons?domain=www.google.com' />
  // <img height="16" width="16" src='https://api.statvoo.com/favicon/?url=google.com' />
  // try {
  const result = await axios(
    `http://api.linkpreview.net/?key=${process.env.LinkApiKEY}&q=${url}`
  );
  const faviconUrl = `http://www.google.com/s2/favicons?domain=${url}`;

  return { ...result.data, favicon: faviconUrl };
};

module.exports = getUrlData;
