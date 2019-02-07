import { Component } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'mtm-error-ui-component',
  templateUrl: './error-ui-component.component.html',
  styleUrls: ['./error-ui-component.component.less']
})
export class ErrorUiComponentComponent {

  errorObj;
  constructor(private dataService: DataService) {
    this.dataService._errorObject.subscribe((response) => {
      this.errorObj = response;
    });
  }


}
