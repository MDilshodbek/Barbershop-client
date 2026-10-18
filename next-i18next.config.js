module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "kr", "ru", "cn"],
    localeDetection: false,
  },
  // Translation keys are plain sentences ("Level:", "journey with us."),
  // so ":" and "." must not be parsed as namespace/nesting separators.
  nsSeparator: false,
  keySeparator: false,
  trailingSlash: true,
};
