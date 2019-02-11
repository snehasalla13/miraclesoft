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
    });


  }

     // console.log(res);
      // console.log(this.empList[0]);
      // console.log(this.loggedInUser.Loginid);

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    }
  }

