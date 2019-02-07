import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {DataService} from '../services/data.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  obj;

  /** Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them. **/
  constructor(private injector: Injector) {
  }

  handleError(error: Error | HttpErrorResponse) {
    const router = this.injector.get(Router);
    const dataService = this.injector.get(DataService);
    this.obj = Object.assign({}, error);

    if (error['status'] === 401) {
      /** Handle 401 separately. Clear login status**/
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('loggedInUser');
      router.navigate(['/error']);
    } else if (error['status'] === 504) {
      // do nothing
    } else if (!(error instanceof HttpErrorResponse)) {


      if (error['rejection'] && error['rejection'].message === 'Failed to register a ServiceWorker: A bad HTTP response code (404) was received when fetching the script.') {

      } else {
        /** Handle Client Error (Angular Error, ReferenceError...) **/
        this.obj.status = 'INTERNAL_ERROR';
        dataService._errorObject.next(this.obj);
        console.log(error);
        // router.navigate(['/error']);
      }
    } else if (error instanceof HttpErrorResponse) {

      if (!(/token$/.test(this.obj.url))) {
        dataService._errorObject.next(this.obj);
        router.navigate(['/error']);
      }
    }

    /** All errors lead to /error route. error details are in dataService._errorObject **/


  }
}
