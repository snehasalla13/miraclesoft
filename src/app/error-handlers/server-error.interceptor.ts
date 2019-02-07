import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler):     Observable<HttpEvent<any>> {
    // If the call fails, retry until 3 times before throwing an error
    if (request['status'] !== 404) {
      return next.handle(request).retry(3);
    } else {
      return next.handle(request);
    }
  }
}
