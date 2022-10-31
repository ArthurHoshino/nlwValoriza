import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayLoad {
    sub: string;
}

export function ensureAuthenticate(request: Request, response: Response, next: NextFunction) {
    /* ----- RECEBER O TOKEN ----- */
    const authToken = request.headers.authorization;

    /* ----- VALIDAR SE TOKEN ESTÁ PREENCHIDO ----- */
    if (!authToken) {
        return response.status(401).end();
        // vai pegar a mensagem padrão do erro 401
        // podemos testar desabilitando o método bearer no insomnia
    }

    // token está vindo dessa forma: Bearer (o token aqui)
    // então vamos menosprezar a palavra "bearer"
    const [,token] = authToken.split(" ") 
    // separa a string por meio do parâmetro do espaço e cria um array
    /* pego somente a segunda informação do array e salvo na variável token, a primeira informação
    eu apenas ignoro */

    /* ----- VALIDAR SE TOKEN É VÁLIDO ----- */
    try {
        const { sub } = verify(token, "162c649f6f60b958cdbae5387ad7c641") as IPayLoad;
        
        /* ----- RECUPERAR INFORMAÇÕES DO USUÁRIO ----- */
        request.user_id = sub;

        return next();
    } catch (err) {
        return response.status(401).end();
    }
}
