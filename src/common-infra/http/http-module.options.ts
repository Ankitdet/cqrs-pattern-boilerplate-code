// src/interfaces/http-module.options.ts
import { AxiosRequestConfig } from 'axios';

export interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  retryOnStatuses?: number[];
}

export interface HttpModuleOptions {
  axios?: AxiosRequestConfig;
  retry?: RetryOptions;
}
