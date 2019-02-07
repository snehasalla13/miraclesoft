import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {HubbleService} from '../../services/hubble.service';
import {Status} from '../../model/status.model';
import {User} from '../../model/user.model';
import {Task} from '../../model/task.model';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.less']
})
export class TaskCardComponent implements OnInit {

  public isCollapsed = true;
  @Input() task: Task;
  @Input() history;
  empListAssignee = [];
  empListWatcher = [];
  lastKeypress = 0;
  watcherName;
  assignId;
  loggedInUser: User;
  statusDesc = '';
  watchers;
  watcher;
  currentTask: Task = new Task();
  dueDate = {'year': 0, 'month': 0, 'day': 0};
  minDate = {'year': 0, 'month': 0, 'day': 0};
  @ViewChild('editTaskForm') editTaskForm: any;
  @ViewChild('addStatusForm') addStatusForm: any;
  @ViewChild('reAssignForm') reAssignForm: any;

  constructor(private taskService: TaskService, private hubbleService: HubbleService, private dataService: DataService) {

  }

  resetCurrentTask() {
    this.currentTask = Object.assign(new Task(), this.task);
    this.statusDesc = '';
    this.watchers = this.task.watchers;
    this.assignId = this.loggedInUser.LoginId;

    const date = new Date(this.currentTask.dueDate);
    this.dueDate.year = date.getUTCFullYear();
    this.dueDate.month = date.getUTCMonth() + 1;
    this.dueDate.day = date.getUTCDate();

    this.minDate.year = date.getUTCFullYear();
    this.minDate.month = date.getUTCMonth() + 1;
    this.minDate.day = date.getUTCDate();

    /** reset the form validations and mark them as untouched **/
    this.editTaskForm.form.markAsUntouched();
    this.editTaskForm.form.markAsPristine();

    this.addStatusForm.form.markAsUntouched();
    this.addStatusForm.form.markAsPristine();

    this.reAssignForm.form.markAsUntouched();
    this.reAssignForm.form.markAsPristine();
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.task = Object.assign(new Task(), this.task);
    this.currentTask = Object.assign(new Task(), this.task);
    this.watchers = this.task.watchers;
    this.assignId = this.loggedInUser.LoginId;
    const date = new Date(this.currentTask.dueDate);
    this.dueDate.year = date.getUTCFullYear();
    this.dueDate.month = date.getUTCMonth() + 1;
    this.dueDate.day = date.getUTCDate();

    this.minDate.year = date.getUTCFullYear();
    this.minDate.month = date.getUTCMonth() + 1;
    this.minDate.day = date.getUTCDate();

  }

  addAssignee(name) {
    this.assignId = name.LoginId;
    this.empListAssignee = [];
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

  addStatus(formData) {
    let assignedList: Task[];
    let completedList: Task[];
    this.dataService._assignedTasksFromService.subscribe((response: Task[]) => {
      assignedList = response;
    });
    this.dataService._completedTasksFromService.subscribe((response: Task[]) => {
      completedList = response;
    });
    const status: Status = new Status();
    status.updateBy = this.loggedInUser.LoginId;
    status.desc = this.statusDesc;
    status.percentage = formData.completionPercent;
    const data = {
     /* 'completionPercent': formData.completionPercent,
      'newstatus': 'pending',*/
      'statusUpdate': status
    };

    this.taskService.addStatus(this.task, data, this.loggedInUser).subscribe(res => {
      /** reset the form **/
      this.statusDesc = '';
      this.addStatusForm.form.markAsUntouched();
      this.addStatusForm.form.markAsPristine();

      if (formData.completionPercent === 100 && this.task.completionPercent !== 100) {
        /** when a task progress hits 100
         * move the task from assigned task list to completed list
         */
        for (let i = 0; i < assignedList.length; i++) {
          if (assignedList[i]._id === this.task._id) {
            assignedList.splice(i, 1);
          }
        }
        this.dataService._assignedTasksFromService.next(assignedList);
        this.task = Object.assign(new Task(), res);
        completedList.unshift(this.task);
        this.dataService._completedTasksFromService.next(completedList);
      } else if (formData.completionPercent !== 100 && this.task.completionPercent === 100) {
        /** when a completed task progress is being pushed back
         * move the task from completed list to assigned task list
         */
        for (let i = 0; i < completedList.length; i++) {
          if (completedList[i]._id === this.task._id) {
            completedList.splice(i, 1);
          }
        }

        this.dataService._completedTasksFromService.next(completedList);
        this.task = Object.assign(new Task(), res);
        assignedList.unshift(this.task);
        this.dataService._assignedTasksFromService.next(assignedList);
      } else {
        /** just update the task object with API response **/
        this.task = Object.assign(new Task(), res);
      }
      this.resetCurrentTask();
    });


  }


  editTask() {
    const tempDate = new Date(this.task.dueDate);
    tempDate.setFullYear(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day);
    this.currentTask.dueDate = tempDate.toISOString();
    this.currentTask.assignedTo = this.assignId;
    this.taskService.updateTask(this.currentTask, this.loggedInUser, false).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      this.resetCurrentTask();
    });
  }

  reAssignTask() {
    if (this.task.assignedTo !== this.assignId) {
        this.task.assignedTo = this.assignId;
        let assignedList: Task[];
        let completedList: Task[];
        this.dataService._assignedTasksFromService.subscribe((response: Task[]) => {
          assignedList = response;
        });
      this.dataService._completedTasksFromService.subscribe((response: Task[]) => {
        completedList = response;
      });
        this.taskService.updateTask(this.task, this.loggedInUser, true).subscribe(res => {
          this.task = Object.assign(new Task(), res);

          if (this.task.completionPercent !== 100) {
            for (let i = 0; i < assignedList.length; i++) {
              if (assignedList[i]._id === this.task._id) {
                assignedList.splice(i, 1);
              }
            }

            this.dataService._assignedTasksFromService.next(assignedList);
          } else {
            for (let i = 0; i < completedList.length; i++) {
              if (completedList[i]._id === this.task._id) {
                completedList.splice(i, 1);
              }
            }

            this.dataService._completedTasksFromService.next(completedList);
          }

        });

    }
  }

  deleteTask() {
    let assignedList: Task[];

    this.dataService._assignedTasksFromService.subscribe((response: Task[]) => {
      assignedList = response;
    });

    let completedList: Task[];
    this.dataService._completedTasksFromService.subscribe((response: Task[]) => {
      completedList = response;
    });

    let watchList: Task[];
    this.dataService._watchingTasksFromService.subscribe((response: Task[]) => {
      watchList = response;
    });


    this.taskService.deleteTask(this.task, this.loggedInUser).subscribe(res => {
      if (this.task.completionPercent !== 100) {
        for (let i = 0; i < assignedList.length; i++) {
          if (assignedList[i]._id === this.task._id) {
            assignedList.splice(i, 1);
          }
        }

        this.dataService._assignedTasksFromService.next(assignedList);
      } else {
        for (let i = 0; i < completedList.length; i++) {
          if (completedList[i]._id === this.task._id) {
            completedList.splice(i, 1);
          }
        }

        this.dataService._completedTasksFromService.next(completedList);
      }


      for (let i = 0; i < watchList.length; i++) {
        if (watchList[i]._id === this.task._id) {
          watchList.splice(i, 1);
        }
      }
      this.dataService._watchingTasksFromService.next(watchList);

    });

  }

  unsubscribe() {
    let watchList: Task[];
    this.dataService._watchingTasksFromService.subscribe((response: Task[]) => {
      watchList = response;
    });
    let restTaskList: Task[];
    this.dataService._restTasksFromService.subscribe((response: Task[]) => {
      restTaskList = response;
    });
    this.taskService.deleteWatcher(this.task, this.loggedInUser).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      for (let i = 0; i < watchList.length; i++) {
        if (watchList[i]._id === this.task._id) {
          watchList.splice(i, 1);
        }
      }
      this.dataService._watchingTasksFromService.next(watchList);
      restTaskList.unshift(this.task);
      this.dataService._restTasksFromService.next(restTaskList);
    });
  }

  subscribe() {
    let watchList: Task[];
    this.dataService._watchingTasksFromService.subscribe((response: Task[]) => {
      watchList = response;
    });
    let restTaskList: Task[];
    this.dataService._restTasksFromService.subscribe((response: Task[]) => {
      restTaskList = response;
    });

    this.taskService.addWatcher(this.task, this.loggedInUser).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      for (let i = 0; i < restTaskList.length; i++) {
        if (restTaskList[i]._id === this.task._id) {
          restTaskList.splice(i, 1);
        }
      }
      this.dataService._restTasksFromService.next(restTaskList);

      watchList.unshift(this.task);
      this.dataService._watchingTasksFromService.next(watchList);
    });
  }

  addWatcher(user) {
    // if (this.watcher.EmployeeName === user) {
    this.currentTask.watchers.push(user.LoginId);
    this.currentTask.watchers = this.currentTask.watchers.filter(function (item, i, ar) {
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
    for (let i = 0; i < this.currentTask.watchers.length; i++) {
      if (this.currentTask.watchers[i] === user) {
        this.currentTask.watchers.splice(i, 1);
      }
    }
  }


}
