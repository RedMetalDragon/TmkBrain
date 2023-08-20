module.exports = {
    "package.json": ["npx prettier-package-json --write"],
    "*.{ts}": ["npx eslint --config .eslintrc --fix"],
  };
  