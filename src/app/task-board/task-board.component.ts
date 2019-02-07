import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskService} from '../services/task.service';
import {User} from '../model/user.model';
import {Task} from '../model/task.model';
import {HubbleService} from '../services/hubble.service';
import {DataService} from '../services/data.service';

@Component({
  selector: 'mtm-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.less']
})
export class TaskBoardComponent implements OnInit {

  watchList: Task[] = [];
  restTaskList: Task[] = [];
  searchResultList: Task[] = [];
  assignedList: Task[] = [];
  completedTaskList: Task[] = [];
  loggedInUser: User;
  userConfig;
  _dashboard;
  _searchStatus = 'FRESH';


  @Output() passAuth = new EventEmitter<boolean>();

  constructor(private hubbleService: HubbleService, private taskService: TaskService, private dataService: DataService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.userConfig = this.dataService._sidebarConfig;

    this.dataService._dashboardVal = this._dashboard;
    this.dataService._searchStatus.subscribe((response) => {
      this._searchStatus = response;
    });
    this.dataService._searchResults.subscribe((response: Task[]) => {
      this.searchResultList = response;
    });
    this.dataService._assignedTasksFromService.subscribe((response: Task[]) => {
      this.assignedList = response;
    });
    this.dataService._watchingTasksFromService.subscribe((response: Task[]) => {
      this.watchList = response;
    });
    this.dataService._completedTasksFromService.subscribe((response: Task[]) => {
      this.completedTaskList = response;
    });
    this.dataService._restTasksFromService.subscribe((response: Task[]) => {
      this.restTaskList = response;
    });

    if (localStorage.getItem('token') == null) {
      this.passAuth.emit(false);
    }
  }

  fetchTasks(userObj: User) {
    this.taskService.getAssignedTasks(userObj.LoginId).subscribe((response) => {
      this.dataService._assignedTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.assignedList)) {
         this.assignedList = [];
      }
    });
    this.taskService.getWatchingTasks(userObj.LoginId).subscribe((response) => {
      this.dataService._watchingTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.watchList)) {
        this.watchList = [];
      }
    });
    this.taskService.getCompletedTasks(userObj.LoginId).subscribe((response) => {
      this.dataService._completedTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.completedTaskList)) {
        this.completedTaskList = [];
      }
    });
    this.taskService.getRestAllTasks(userObj.LoginId).subscribe((response) => {
      this.dataService._restTasksFromService.next(Object.assign(new Array<Task>(), response));
      if (!Array.isArray(this.restTaskList)) {
        this.restTaskList = [];
      }
    });
  }


  ngOnInit() {
    this.fetchTasks(this.loggedInUser);
  }

}
