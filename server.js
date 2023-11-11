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

  server.route([
    {
      method: 'GET',
      path: '/{id}',
      hander: async(req, h) => {
        const { id } = req.params;

        try { 
          const [order, user] = await Promise.all([
            got(`${orderService}/${id}`),
            got(`${userService/${id}}`),
          ]);

          return {
            id: order.id,
            menu: order.menu,
            user: user.name,
          };

        } catch(err) {
          if(!err.response) throw err;
          if (err.response.statusCode === 400) {
            return h.response({ message: 'bad request'}).code(400);
          }
          if (err.response.statusCode === 404) {
            return h.response({ message: 'not found'}).code(404);
          }

          throw err;
        }
      },
    }
  ])

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
}
