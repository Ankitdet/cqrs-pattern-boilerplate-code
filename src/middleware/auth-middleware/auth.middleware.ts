import {
    Inject,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export const AUTH_MIDDLEWARE_OPTIONS = Symbol("AUTH_MIDDLEWARE_OPTIONS");

export interface AuthMiddlewareOptions {
    headerName?: string;
    validate?: (token: string, req: any) => boolean | Promise<boolean>;
    optional?: boolean;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(AUTH_MIDDLEWARE_OPTIONS)
        private readonly options: AuthMiddlewareOptions,
    ) { }

    async use(req: Request, _res: Response, next: NextFunction) {
        const { headerName = "authorization", validate, optional } = this.options;
        const authHeader = req.headers[headerName];
        if (!authHeader) {
            if (optional) return next();
            throw new UnauthorizedException("Authorization header missing");
        }
        const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        const token = headerValue.replace("Bearer ", "");
        if (validate && !(await validate(token, req))) {
            throw new UnauthorizedException();
        }
        next();
    }
}
