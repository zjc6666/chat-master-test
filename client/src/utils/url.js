
// process.env.NODE_ENV ,标识是生产环境或者开发环境的依据
const isProduction = process.env.NODE_ENV === 'production';

// const url = isProduction ? 'http://localhost:3000' : 'http://localhost:8080';
const url = 'http://localhost:8080'

const apiUrl = '/api';  


export {
  apiUrl,
  url
};
