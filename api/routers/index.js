import express from 'express';
import requireGlob from 'require-glob';

const router = express.Router();

const generateKey = path => path
  .replace(/\/index\.js$/, '')
  .replace(/_/g, ':');

const modules = requireGlob.sync('./*/**/index.js', {
  reducer: ({ base }, result, file) => ({
    ...result,
    [generateKey(file.path.replace(base, ''))]: (() => {
      const method = Object.keys(file.exports)[0];
      return {
        method,
        middleware: file.exports[method],
      };
    })(),
  }),
});

Object.keys(modules).map((path, i) => {
  const { method, middleware } = modules[path];

  if (!router[method]) return;

  router[method](path, middleware);
});

export default router;
