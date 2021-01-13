import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === 'production';

const config = {
  input: 'src/index.js',
  output: {
    name: 'VueLocalStore',
    file: `dist/vue-localstore${isProd ? '.min' : ''}.js`,
    format: 'umd',
    compact: isProd
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    commonjs()
  ],
};

if (isProd) {
  config.plugins.push(terser());
}

export default config;
