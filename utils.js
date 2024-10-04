const errRes = (message) => ({ error: message });

const urlRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;

const isUrlValid = (url) => urlRegex.test(url);

module.exports = { errRes, isUrlValid };
