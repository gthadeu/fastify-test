import Fastify from "fastify";
import fjwt from '@fastify/jwt'
import { FastifyRequest, FastifyReply } from 'fastify';
import userRoutes from "./modules/user/user.route";
import { uSchemas } from "./modules/user/user.schema";
import { pSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";
import swagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod';
import { version } from '../package.json';


export const server = Fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    }
  }
}

server.register(fjwt, {
  secret: 'm8443f632m783e!6m8224a4nm34!x2263ja4v8fr',
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (e) {
    return reply.send(e)
  }
})

server.get('/healthcheck', async function () {
  return { status: "OK" }
})


async function main() {

  for (const schema of [...uSchemas, ...pSchemas]) {
    server.addSchema(schema);
  }

  // server.register(
  //   swagger,
  //   withRefResolver({
  //     routePrefix: "/docs",
  //     exposeRoute: true,
  //     staticCSP: true,
  //     openapi: {
  //       info: {
  //         title: "Fastify API",
  //         description: "API for some products",
  //         version,
  //       }
  //     }
  //   })
  // )

  server.register(userRoutes, { prefix: 'api/users' })
  server.register(productRoutes, { prefix: 'api/products' })
  try {
    // set host 0.0.0.0 (usado para o docker pois ele espera que seu host seja 0.0.0.0)
    await server.listen({port: 3000, host: "0.0.0.0"})
    console.log(`Server ready at http://localhost:3000`)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

main();