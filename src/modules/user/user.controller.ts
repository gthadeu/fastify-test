import { FastifyRequest, FastifyReply } from 'fastify';
import { server } from '../../app';
import { verifyPassword } from '../../utils/hash';
import { CreateUserInput, LoginInput, userSchemas } from './user.schema';
import { createUser, findUserByEmail, findUsers } from './user.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body:CreateUserInput
  }>,
  reply: FastifyReply
) {

  const body = request.body
  try {
    const user = await createUser(body)
    return reply.code(201).send(user)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
  Body:LoginInput,
}>, 
reply: FastifyReply){
  const body = request.body

  //find user by email
  const user = await findUserByEmail(body.email)

  if(!user){
    return reply.code(401).send({
      message: " Invalid email or password",
    })
  }
  // verify password
const correctPassword = verifyPassword({
  candidatePassword: body.password,
  salt: user.salt,
  hash: user.password
})

if(correctPassword){
  const {password, salt, ...rest} = user
  return {accessToken: server.jwt.sign(rest)}
}
  // generate access token

  //response




}

export async function getUsersHandler(){
  const users = await findUsers()

  return users;
}