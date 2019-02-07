import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../model/user.model';
import {Task} from '../model/task.model';
import {HubbleService} from '../services/hubble.service';
import {TaskService} from '../services/task.service';
import {NotificationService} from '../services/notification.service';
import {DataService} from '../services/data.service';
import {ProfileService} from '../services/profile.service';

@Component({
  selector: 'mtm-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.less']
})
export class TopbarComponent implements OnInit {

  loggedInUser: User;
  @Output() passAuth = new EventEmitter<boolean>();
  watcherName;
  watchers;
  assignId = '';
  newTask: Task = new Task();
  watchList: Task[] = [];
  restTaskList: Task[] = [];
  assignedList: Task[] = [];
  empListAssignee = [];
  empListWatcher = [];

  lastKeypress = 0;
  listOfWatchers: string[] = [];
  watcher;
  loginName;
  notifications = [];
  currentDate = {
    'year': new Date().getUTCFullYear(),
    'month': new Date().getUTCMonth() + 1,
    'day': new Date().getUTCDate()
  };

  defaultDate =  {
    'year': new Date().getUTCFullYear(),
    'month': new Date().getUTCMonth() + 1,
    'day': new Date().getUTCDate()
  };

  isOnline = window.navigator.onLine;
  profileData;

  @ViewChild('createTaskForm') createTaskForm: any;

  constructor(private router: Router, private hubbleService: HubbleService, private profileService: ProfileService,
              private taskService: TaskService, private notificationService: NotificationService, public dataService: DataService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.addAssignee(this.loggedInUser);
  }

  ngOnInit() {
    this.loggedInUser = new User();
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.notificationService.getPermission();
    this.notificationService.receiveMessage();
    this.dataService._notification.subscribe((res) => {
      if (res !== null) {
        this.notifications.push(res);
      }
    });
    this.profileService.getProfileInformation('userid').subscribe(res => this.profileData = res);
    this.dataService._assignedTasksFromService.subscribe((response: Task[]) => {
      this.assignedList = response;
    });
    this.dataService._watchingTasksFromService.subscribe((response: Task[]) => {
      this.watchList = response;
    });
    this.dataService._restTasksFromService.subscribe((response: Task[]) => {
      this.restTaskList = response;
    });

 /*   this.notifications.push({
      'notification': {'body' : 'Abhishek Harish Rattihalli (@arattihalli) updated the status of task \'testing due date time\'',
        'click_action' : '/tasks/5b4f404d42db5035ecabc7a0'}
    });

    this.notifications.push({
      'notification': {'body' : 'Abhishek Harish Rattihalli (@arattihalli) updated the status of task \'testing due date time\'',
        'click_action' : '/tasks/5b4f404d42db5035ecabc7a0'}
    });
    this.notifications.push({
      'notification': {'body' : 'Abhishek Harish Rattihalli (@arattihalli) updated the status of task \'testing due date time\'',
        'click_action' : '/tasks/5b4f404d42db5035ecabc7a0'}
    });
    this.notifications.push({
      'notification': {'body' : 'Abhishek Harish Rattihalli (@arattihalli) updated the status of task \'testing due date time\'',
        'click_action' : '/tasks/5b4f404d42db5035ecabc7a0'}
    });
    this.notifications.push({
      'notification': {'body' : 'Abhishek Harish Rattihalli (@arattihalli) updated the status of task \'testing due date time\'',
        'click_action' : '/tasks/5b4f404d42db5035ecabc7a0'}
    });*/
  }

  resetNewTask() {
    this.newTask = new Task();
    this.addAssignee(this.loggedInUser);
    this.listOfWatchers = [];
    this.currentDate = {
      'year': new Date().getUTCFullYear(),
      'month': new Date().getUTCMonth() + 1,
      'day': new Date().getUTCDate()
    };
    this.defaultDate = {
      'year': new Date().getUTCFullYear(),
      'month': new Date().getUTCMonth() + 1,
      'day': new Date().getUTCDate()
    };

    this.createTaskForm.form.markAsUntouched();
    this.createTaskForm.form.markAsPristine();
  }



  logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInUser');
    this.passAuth.emit(false);
  }

  getSuggestion($event, operation) {
    if ($event.target.value.length > 3 && $event.timeStamp - this.lastKeypress > 200) {
      this.hubbleService.suggest($event.target.value)
        .subscribe((empList) => {
          if (operation === 'assignee') {
            this.empListAssignee = empList['employees'];
          } else if (operation === 'watcher') {
            this.empListWatcher = empList['employees'];
          }
        });
    } else {
      this.empListAssignee = [];
      this.empListWatcher = [];
    }
  }

  addAssignee(user) {
    this.assignId = user.LoginId;
    this.empListAssignee = [];
  }

  createTask(data) {
    let task: Task;
    task = data;
    task.assignedTo = this.assignId;
    task.owner = this.loggedInUser.LoginId;
    task.watchers = this.listOfWatchers;
    const tempDate = new Date();
    tempDate.setUTCDate(data.dueDate.day);
    tempDate.setUTCMonth(data.dueDate.month - 1);
    tempDate.setUTCFullYear(data.dueDate.year);
    tempDate.setHours(12, 0, 0 , 0);
    task.dueDate = tempDate.toISOString();
    this.taskService.createTask(task, this.loggedInUser).subscribe((response) => {
      task = Object.assign(new Task(), response);
      task.newTask = true;
      if (task.getUserRole(this.loggedInUser) === 'ROLE_ASSIGNEE') {
        this.assignedList.unshift(task);
        this.dataService._assignedTasksFromService.next(this.assignedList);
      } else if (task.getUserRole(this.loggedInUser) === 'ROLE_WATCHER') {
        this.watchList.unshift(task);
        this.dataService._watchingTasksFromService.next(this.watchList);
      } else {
        this.restTaskList.unshift(task);
        this.dataService._restTasksFromService.next(this.restTaskList);
      }

      this.resetNewTask();

    });
  }


  addWatcher(user) {
    // if (this.watcher.EmployeeName === user) {
    this.listOfWatchers.push(user.LoginId);
    this.listOfWatchers = this.listOfWatchers.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });
    this.empListWatcher = [];
    this.watcher = null;
    this.watcherName = null;

    // }
  }

  setWatcher(user) {
    this.watcher = user;
    this.empListWatcher = [];
    this.watcherName = user.EmployeeName;
  }

  deleteWatcher(user) {
    for (let i = 0; i < this.listOfWatchers.length; i++) {
      if (this.listOfWatchers[i] === user) {
        this.listOfWatchers.splice(i, 1);
      }
    }
  }
}
