const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Combine existing externals (if any) with firebase-admin
  const existingExternals = config.externals || [];

  config.externals = [
    ...[].concat(existingExternals),
    {
      'firebase-admin': 'commonjs firebase-admin',
    },
  ];

  return config;
});