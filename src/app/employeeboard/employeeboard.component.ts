import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {DataService} from '../services/data.service';


@Component({
  selector: 'mtm-employeeboard',
  templateUrl: './employeeboard.component.html',
  styleUrls: ['./employeeboard.component.less']
})
export class EmployeeboardComponent implements OnInit {


  empList = [];
  loggedInUser;
  dtOptions: DataTables.Settings = {};



  constructor(private profileService: ProfileService, private dataService: DataService) {

    let _dashboard;
    _dashboard = true;
    this.dataService._dashboardVal = _dashboard;

    this.profileService.getEmployeeBoard().subscribe(res => {
      this.empList = Object.assign([], res);
      console.log(this.empList);
     // console.log(res);
      // console.log(this.empList[0]);
      // console.log(this.loggedInUser.Loginid);

      // length = this.keyval.length;
      // const keyval = Object.keys(res);
      //  console.log(keyval);
    });
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

  }



  // ngOnInit() {
  //   this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  //     this.dtOptions = {
  //       paging: false,
  //       // searching: false,
  //       rowCallback : (row: Node, data: any[] | Object, index: number) => {
  //       const self = this;
  //       $('td', row).unbind('click');
  //       $('td', row).bind('click', () => {
  //         this.rowClick(row, data, index);
  //       });
  //       return row;
  //     },
  //     bInfo : false,
  //     order: [[2, 'asc']]
  //   };
  // }
  // rowClick(row: Node, data: any[] | Object, index: number) {
  //   const userData = {
  //     hubbleID : data[1],
  //     activeTasks : data[0]
  //   };
  //   this.openModal(userData, false);
  // }

  // toFloat(str) {
  //   return Number.parseFloat(str);
  // }

  // getDifference(num1, num2) {
  //   num1 = this.toFloat(num1);
  //   num2 = this.toFloat(num2);
  //   if (num1 > num2) {
  //     return (num1 - num2).toFixed(2);
  //   } else {
  //     return (num2 - num1).toFixed(2);
  //   }
  // }

}
