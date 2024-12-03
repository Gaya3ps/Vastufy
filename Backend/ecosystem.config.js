module.exports = {
    apps: [{
      name: 'server',
      script: './dist/server.js',
      env: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID, // Refer to environment variable
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY, // Refer to environment variable
        AWS_REGION: 'ap-southeast-2',
        AWS_BUCKET_NAME: 'vastufy',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    }],
  };
  