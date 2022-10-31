import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from "bcryptjs" // biblioteca para criptografar coisas

interface IUserRequest {
    name: string;
    email: string;
    admin?: boolean;
    password: string;   
}

class CreateUserService {
    async execute({ name, email, admin = false, password }: IUserRequest) {
        const usersRepository = getCustomRepository(UsersRepositories);

        if(!email) {
            throw new Error("Email is incorrect")
        }

        const userAlredyExists = await usersRepository.findOne({
            email,
        })

        if (userAlredyExists) {
            throw new Error("User already exists");
        }

        const passwordHash = await hash(password, 8);
        // isso cria a criptografia

        const user = usersRepository.create({
            name,
            email,
            admin,
            password: passwordHash,
        })

        await usersRepository.save(user);

        return user;
    }
}

export{ CreateUserService }
