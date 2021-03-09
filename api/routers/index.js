import requireGlob from 'require-glob';

const generateKey = path => path
  .replace(/\/index\.js$/, '');

const modules = requireGlob.sync('./*{,/*}/index.js', {
  reducer: ({ base }, result, file) => ({
    ...result,
    [generateKey(file.path.replace(base, ''))]: file.exports.default,
  }),
});

export default Object.keys(modules).map(path => [
  path,
  modules[path],
]);
