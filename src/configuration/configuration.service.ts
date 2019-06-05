import { Injectable, Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

/**
 * Service to manage environments variables
 * ConfigurationService is available for the whole application
 */
@Global()
@Injectable()
export class ConfigurationService {
    private readonly envConfig: { [key: string]: string };

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = this.validateInput(config);
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    /**
     * Use to define env. params structure
     * @param envConfig
     */
    private validateInput(envConfig: { [key: string]: string }): { [key: string]: string } {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid(['dev', 'prod', 'test'])
                .default('dev'),
            DB_TYPE: Joi.string().required(),
            DB_HOST: Joi.string().required(),
            DB_PORT: Joi.number().required(),
            DB_USERNAME: Joi.string().required(),
            DB_PASSWORD: Joi.string().required(),
            DB_NAME: Joi.string().required(),
            JWT_SECRET_KEY: Joi.string().required(),
            JWT_EXPIRATION_DELAY: Joi.number().required(),
        });

        const { error, value: validatedEnvConfig } = Joi.validate(
            envConfig,
            envVarsSchema,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
}
