import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TaskService} from '../services/task.service';
import {User} from '../model/user.model';
import {ProfileService} from '../services/profile.service';
import {Task} from '../model/task.model';
import {DataService} from '../services/data.service';
import {Chart} from 'chart.js';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'mtm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  public id;
  public userid;
  LoginId;
  public firstName;
  user: User;
  assignedList: Task[] = [];
  watchingList: Task[] = [];
  completedList: Task[] = [];
  doughnut;
  barChart;
  profileData;
  edit = false;
  currentWeek = [0, 0, 0];
  previousWeek = [0, 0, 0];
  overall = [0, 0, 0];
  processing = false;

  constructor(private profileService: ProfileService, private dataService: DataService,
    private taskService: TaskService, private route: ActivatedRoute) {
    let _dashboard;
    _dashboard = true;
    this.dataService._dashboardVal = _dashboard;
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    Chart.defaults.global.defaultFontFamily = 'Montserrat';
  }
  isvalidUser() {
    // console.log(this.userid);
    return this.user.LoginId === this.userid;
    //  console.log(this.LoginId);
 }
  ngAfterViewInit() {
    this.dataService._assignedTasksFromService.subscribe((response: Task[]) => {
      this.assignedList = response;
      this.generateChart();
    });
    this.dataService._watchingTasksFromService.subscribe((response: Task[]) => {
      this.watchingList = response;
      this.generateChart();
    });
    this.dataService._completedTasksFromService.subscribe((response: Task[]) => {
      this.completedList = response;
      this.generateChart();
    });



    this.profileService.getProfileInformation(this.userid).subscribe(res => {
      this.profileData = res;
      this.firstName = this.profileData.name;
      // console.log(this.profileData.name);
      this.currentWeek = [/*this.profileData['weekBoard']['rank'],*/
        this.profileData['weekBoard']['taskCount'],
        parseFloat(this.profileData['weekBoard']['score']['$numberDecimal'])];


      this.previousWeek = [/*this.profileData['previousWeekBoard']['rank'],*/
        this.profileData['previousWeekBoard']['taskCount'],
        parseFloat(this.profileData['previousWeekBoard']['score']['$numberDecimal'])];

      this.overall = [/*this.profileData['overallBoard']['rank'],*/
        this.profileData['overallBoard']['taskCount'],
        parseFloat(this.profileData['overallBoard']['score']['$numberDecimal'])];
      this.generateChart();
    });
  }

  //  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //       if (paramMap.has('userid')) {
    //         this.userid = paramMap.get('userid');
    //     }
    //    });

  // ngOnInit() {
  //   this.fetchTasks(this.user);
  // }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userid')) {
        this.userid = paramMap.get('userid');
        this.fetchTasks(this.user);
    }
   });
  }


  fetchTasks(userObj: User) {
    this.taskService.getAssignedTasks(this.userid).subscribe((response) => {
      this.dataService._assignedTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.assignedList)) {
        this.assignedList = [];
      }
    });
    this.taskService.getWatchingTasks(this.userid).subscribe((response) => {
      this.dataService._watchingTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.watchingList)) {
        this.watchingList = [];
      }
    });
    this.taskService.getCompletedTasks(this.userid).subscribe((response) => {
      this.dataService._completedTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.completedList)) {
        this.completedList = [];
      }
    });
  }

  saveChanges(formData) {
    this.processing = true;

    const startTime = new Date();
    const hours = formData.startTime.toString().split(':')[0];
    const mins = formData.startTime.toString().split(':')[1];
    startTime.setHours(hours, mins);
    formData.startTime = startTime.toISOString();


    const endTime = startTime;
    endTime.setHours(startTime.getHours() + 9);
    formData.endTime = endTime.toISOString();

    console.log(formData);

    this.profileService.saveProfileSettings(formData).subscribe(
      res => {
        this.processing = false;
        this.profileData['startTime'] = formData.startTime;
        this.profileData['endTime'] = formData.endTime;
        this.profileData['timeZone'] = formData.timeZone;
        this.edit = false;
      }
    );
  }


  generateChart() {

    this.doughnut = new Chart('doughnut', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.assignedList.length, this.watchingList.length, this.completedList.length],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['Assigned Tasks', 'Watching Tasks', 'Completed Tasks']
      }
    });


    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Weekly Average',
          data: this.overall,
          // backgroundColor: '#393E41'
          backgroundColor: '#026C7C'
        }, {
          label: 'Previous Week',
          data: this.previousWeek,
          backgroundColor: '#E69942'
        }, {
          label: 'Current Week',
          data: this.currentWeek,
          backgroundColor: '#F0544F'
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [/*'Rank',*/ 'Completed Tasks', 'Score']
      }
    });
  }
}
