import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, CountSchema, model, property, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import _ from "lodash";
import {PasswordHasher} from '../authentication/hash.password.bcryptjs';
import {JWTService} from '../authentication/jwt-services';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../authentication/keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {CredentialsRequestBody} from './specs/user-controller.spec';
@model()
export class NewUserRequest extends User {
  @property({
    type: "string",
    required: true
  })
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
    @inject(UserServiceBindings.USER_SERVICE) public userService: UserService<User, Credentials>,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: {'x-ts-type': User}
          }
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
          // schema: {'x-ts-type': User}
        },
      },
    })
    newUserRequest: NewUserRequest
  ): Promise<User> {
    // validateCredentials(_.pick(newUserRequest, ["email", "password"]))

    const password = await this.passwordHasher.hashPassword(newUserRequest.password)
    console.log("UserController -> password", password)
    console.log("UserController -> newUserRequest", newUserRequest)

    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, ["password"])
    );

    await this.userRepository
      .userCredentials(savedUser.id)
      .create({password})

    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  // @get('/users', {
  //   responses: {
  //     '200': {
  //       description: 'Array of User model instances',
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'array',
  //             items: getModelSchemaRef(User, {includeRelations: true}),
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(User) filter?: Filter<User>,
  // ): Promise<User[]> {
  //   return this.userRepository.find(filter);
  // }

  // @patch('/users', {
  //   responses: {
  //     '200': {
  //       description: 'User PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  //   @param.where(User) where?: Where<User>,
  // ): Promise<Count> {
  //   return this.userRepository.updateAll(user, where);
  // }

  // @get('/users/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'User model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(User, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  // ): Promise<User> {
  //   return this.userRepository.findById(id, filter);
  // }

  // @patch('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  // ): Promise<void> {
  //   await this.userRepository.updateById(id, user);
  // }

  // @put('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() user: User,
  // ): Promise<void> {
  //   await this.userRepository.replaceById(id, user);
  // }

  // @del('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.userRepository.deleteById(id);
  // }
}

