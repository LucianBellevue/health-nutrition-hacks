const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['advanced', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          reduceIdents: false, // Keep for debugging
          mergeRules: true,
          minifySelectors: true,
          cssDeclarationSorter: { order: 'concentric-css' },
          discardUnused: true,
          mergeIdents: true,
          reduceInitial: true,
          svgo: true,
        }],
      },
    } : {}),
  },
};

export default config;
