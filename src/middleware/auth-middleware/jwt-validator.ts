import * as jwt from "jsonwebtoken";

export interface JwtValidatorOptions {
    secret: string;
    algorithms?: jwt.Algorithm[];
}

export function jwtValidator(options: JwtValidatorOptions) {
    return (token: string): boolean => {
        try {
            jwt.verify(token, options.secret, {
                algorithms: options.algorithms,
            });
            return true;
        } catch {
            return false;
        }
    };
}