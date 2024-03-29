import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRepositories";


interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {
    async execute({email, password}: IAuthenticateRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        // verificar se email existe
        const user = await usersRepositories.findOne({
            email,
        })

        if (!user) {
            throw new Error("Email/password is incorrect");
        }

        // verificar se senha está correta
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Email/password is incorrect");
        }

        // gerar token
        const token = sign(
            {
                email: user.email,
            }, "162c649f6f60b958cdbae5387ad7c641",
            {
                subject: user.id,
                expiresIn: "1d",
            }
        );

        return token;
    }
}


export { AuthenticateUserService }
