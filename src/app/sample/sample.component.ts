import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'mtm-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.less']
})

// export class SampleComponent implements OnInit {
//   ngOnInit(){
//
//   }
// }
export class SampleComponent implements OnInit {
dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }
 }
