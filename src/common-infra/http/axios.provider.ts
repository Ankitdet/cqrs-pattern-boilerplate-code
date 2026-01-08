// src/providers/axios.provider.ts
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { Provider } from '@nestjs/common';
import { AXIOS_INSTANCE_TOKEN } from './http.constant';
import { HttpModuleOptions } from './http-module.options';

export const createAxiosProvider = (
  options: HttpModuleOptions,
): Provider => ({
  provide: AXIOS_INSTANCE_TOKEN,
  useFactory: (): AxiosInstance => {
    const instance = axios.create(options.axios);
    axiosRetry(instance, {
      retries: options.retry?.retries ?? 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        const status = error.response?.status;
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          options.retry?.retryOnStatuses?.includes(status)
        );
      },
    });
    return instance;
  },
});
