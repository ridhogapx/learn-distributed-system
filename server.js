const hapi = require('@hapi/hapi');

const {
  ORDER_SERVICE = 4000,
  USER_SERVICE = 5000,
} = process.env;

const service = {
  orderService: `http://localhost:${ORDER_SERVICE}`,
  userService: `http://localhost:${USER_SERVICE}`,
}

const init = async() => {
  const server = hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
}
