require("module-alias/register");
import { BASE_URL, PORT } from "@core-common/constant/app.constant";
import { LoggerService } from "@core-common/logger";
import { GlobalExceptionHandler } from "@middleware/filter/global-exeception.filter";
import { ResponseHandler } from "@middleware/interceptor/response-handler";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json } from "body-parser";
import { urlencoded } from "express";
import { MainModule } from "./main.module";

let logger: LoggerService;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    bodyParser: true,
    cors: {
      origin: ["http://localhost:3000"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    },
    logger
  });

  logger = app.get(LoggerService);

  app.setGlobalPrefix(BASE_URL);

  app.use(json({ limit: "100mb" }));

  app.use(urlencoded({ extended: true, limit: "100mb" }));

  setupValidationPipe(app);

  app.useGlobalInterceptors(new ResponseHandler(logger));

  app.useGlobalFilters(new GlobalExceptionHandler());

  await app.listen(PORT || 3000);

  return app;
}

process
  .on("unhandledRejection", (reason, p) => {
    logger.error(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
  })
  .on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception thrown: ${err.message}`, {}, err);
    process.exit(1);
  });

bootstrap()
  .then(async () => {})
  .catch((err) => {
    logger.error(
      `App initilization failed due to, ${JSON.stringify(err, null, 2)}`,
    );
  });

function setupValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );
}
