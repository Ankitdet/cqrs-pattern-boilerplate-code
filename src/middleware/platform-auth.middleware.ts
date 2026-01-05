import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request, Response> {
  use(req: Request, _res: Response, next: () => void): void {
    const authHeader = req.headers["authorization"];
    // Implement your authentication logic here
    // For example, validate JWT token from authHeader      
    console.log("Auth Middleware executed", authHeader);
    next();
  }
}
