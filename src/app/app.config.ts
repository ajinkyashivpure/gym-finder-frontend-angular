import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors, withJsonpSupport} from '@angular/common/http';
import { routes } from './app.routes';
import {jwtInterceptor} from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor]),
      withJsonpSupport()
    ),
  ]
};
