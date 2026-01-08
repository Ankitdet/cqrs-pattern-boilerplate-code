import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface DBModuleOptions {
    typeOrmOptions?: Partial<TypeOrmModuleOptions>;
    useConfigService?: boolean;
}