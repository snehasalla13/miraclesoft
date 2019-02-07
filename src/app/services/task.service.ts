import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {User} from '../model/user.model';
import {NotificationService} from './notification.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Task} from '../model/task.model';
import {ToastService} from './toast.service';
import {absFloor} from 'ngx-bootstrap/chronos/utils';
import {MtalkService} from './mtalk.service';


@Injectable()
export class TaskService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseURL = environment.serverBaseURL;
  loggedInUser;

  constructor(public http: HttpClient,
    private notificationService: NotificationService,
    private toastService: ToastService, private mtalkService: MtalkService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  }

  /** Get all tasks assigned to a user with LoginId **/
  getAssignedTasks(LoginId) {
    return this.http.get(this.baseURL + `user/${LoginId}/tasks/assigned`, {headers: this.headers});
  }

  /** Get all tasks a user with LoginId is watching**/
  getWatchingTasks(LoginId) {
    return this.http.get(this.baseURL + `user/${LoginId}/tasks/watching`, {headers: this.headers});
  }

  /** Get all tasks a user with LoginId has completed**/
  getCompletedTasks(LoginId) {
    return this.http.get(this.baseURL + `user/${LoginId}/tasks/completed`, {headers: this.headers});
  }

  /** Get all the tasks which are not assigned to user nor the user is watching (user with Login ID)**/
  getRestAllTasks(LoginId) {
    return this.http.get(this.baseURL + `user/${LoginId}/tasks/rest`, {headers: this.headers});
  }

  /** Get a particular task with id taskId **/
  getTask(taskId) {
    return this.http.get(this.baseURL + `task/${taskId}`, {headers: this.headers});
  }

  /** create a new task **/
  createTask(task: Task, user: User) {
    return this.http.post(this.baseURL + `tasks`, task, {headers: this.headers}).map(res => {
      task = Object.assign(new Task(), res);
      let message = `${user.FName} ${user.LName} (@${task.owner}) added you as a watcher to this task '${task.title}'`;
      // let message = `@${task.assignedTo} added you as a watcher to this task '${task.title}'`;
      task.watchers.forEach((watcher) => {
        this.notificationService.sendMessage(task, message, watcher);
      });

      if (task.owner !== task.assignedTo) {
        message = `${user.FName} ${user.LName} (@${task.owner}) has assigned you a new task '${task.title}'`;
        // message = `@${task.assignedTo} has assigned you a new task '${task.title}'`;
        this.notificationService.sendMessage(task, message, task.assignedTo);
      }
      this.toastService.sendToastMessage('Task created successfully!', 'TYPE_SUCCESS');
      this.toastService.sendToastMessage(`Yay! You got a bonus 25 points for creating the task`, 'TYPE_SUCCESS');
      return res;
    });
  }

  /** update an existing task **/
  updateTask(task: Task, user: User, reAssigned: boolean) {
    return this.http.put(this.baseURL + `task/${task._id}`, task,
      {headers: this.headers}).map(res => {
      let message = `${user.FName} ${user.LName} (@${this.loggedInUser.LoginId})` +
        ` has updated the task '${task.title}'`;

      // const message = `@${task.assignedTo} has updated the task '${task.title}'`;
      task.watchers.forEach((watcher) => {
        this.notificationService.sendMessage(task, message, watcher);
      });

      if (reAssigned) {
        message = `${user.FName} ${user.LName} (@${this.loggedInUser.LoginId})` +
          ` has re-assigned the task '${task.title}' to you.`;
        this.notificationService.sendMessage(task, message, task.assignedTo);
      }

      if (res['points'] === -50) {
        message = `${user.FName} ${user.LName} (@${this.loggedInUser.LoginId})` +
          ` has updated the due date for the task '${task.title}'`;
        this.mtalkService.getMtalkUserIDs(task.watchers).subscribe(res => {
          const mTalkUserIds = {};

          for (const user of res['users']) {
            mTalkUserIds[user.username] = user._id;
          }
          task.watchers.forEach((watcher) => {
            this.mtalkService.sendMessage(this.generateMTalkMessageBody(mTalkUserIds[watcher], task, message));
          });
        });
        this.toastService.sendToastMessage('Due date updated successfully!', 'TYPE_SUCCESS');
        this.toastService.sendToastMessage(`You lost ` + absFloor(res['points']) + `points !`, 'TYPE_ERROR');
      } else {
        this.toastService.sendToastMessage('Task edited successfully!', 'TYPE_SUCCESS');
      }
      return res['doc'];
    });


  }

  /** deleting an existing task **/
  deleteTask(task: Task, user: User) {
    return this.http.delete(this.baseURL + `task/${task._id}`,
      {headers: this.headers}).map(res => {
      /* const message = `${user.FName} ${user.LName} (@${task.assignedTo}) has deleted the task '${task.title}'`;
      task.watchers.forEach((watcher) => {
        this.notificationService.sendMessage(task, message, watcher);
      });*/
      this.toastService.sendToastMessage('Task deleted successfully!', 'TYPE_SUCCESS');
      this.toastService.sendToastMessage(`You lost 25 points for deleting the task`, 'TYPE_ERROR');
      return res;
    });
  }

  /** add a status update to an existing task **/
  addStatus(task: Task, data, user: User) {
    console.log(data.statusUpdate.percentage);
    return this.http.post(this.baseURL + `task/${task._id}/status`, data,
      {headers: this.headers}).map(res => {

      let message = `${user.FName} ${user.LName} (@${task.assignedTo}) updated the status of task '${task.title}'`;
      // let message = `@${task.assignedTo} updated the status of task '${task.title}'`;

      if (data.statusUpdate.percentage === 100) {
        message = `${user.FName} ${user.LName} (@${task.assignedTo}) has completed the task '${task.title}'`;
        // message = `@${task.assignedTo} has completed the task '${task.title}'`;
        this.toastService.sendToastMessage('Hurray! You completed the task!', 'TYPE_SUCCESS');
        if (res['points'] === 25) {
          this.toastService.sendToastMessage(`You scored 10 points !`, 'TYPE_INFO');
          this.toastService.sendToastMessage(`Yay! You got a bonus 15 points for task completion`, 'TYPE_SUCCESS');
        } else if (res['points'] === 10) {
          this.toastService.sendToastMessage(`You scored 2 points !`, 'TYPE_INFO');
          this.toastService.sendToastMessage(`Yay! You got a bonus 8 points for task completion`, 'TYPE_SUCCESS');
        }
      } else {
        this.toastService.sendToastMessage(`Good Job! You've made progress on the task!`, 'TYPE_INFO');
        if (res['points'] !== 0) {
          this.toastService.sendToastMessage(`You scored +` + res['points'] + `points !`, 'TYPE_INFO');
        }
      }
      this.mtalkService.getMtalkUserIDs(task.watchers).subscribe(res => {
        const mTalkUserIds = {};

        for (const user of res['users']) {
          mTalkUserIds[user.username] = user._id;
        }
        task.watchers.forEach((watcher) => {
          this.notificationService.sendMessage(task, message, watcher);
          this.mtalkService.sendMessage(this.generateMTalkMessageBody(mTalkUserIds[watcher], task, message));
        });
      });
      return res['doc'];
    });

  }

  generateMTalkMessageBody(userId, task, message) {
    const msgParams = {};
    msgParams['channel'] = userId;
    msgParams['attachments'] = [{
      'title': task.title,
      'title_link': `${environment.appURL}/tasks/${task._id}`,
      'fields': [{'value': message}]
    }];
    return msgParams;
  }

  /** search for tasks based on filter data **/
  searchTasks(data) {
    return this.http.post(this.baseURL + `tasks/search`, data,
      {headers: this.headers});
  }

  /** remove a watcher from a task **/
  deleteWatcher(task: Task, user: User) {
    return this.http.delete(this.baseURL + `task/${task._id}/watcher/${user.LoginId}`,
      {headers: this.headers}).map(res => {
      const message = `You will no longer receive notifications for the task '${task.title}'`;
      /*  task.watchers.forEach((watcher) => {
          this.notificationService.sendMessage(task, message, watcher);
        });*/
      this.toastService.sendToastMessage(message, 'TYPE_SUCCESS');
      return res;
    });
  }

  /** add a watcher to a task **/
  addWatcher(task: Task, user: User) {
    return this.http.post(this.baseURL + `task/${task._id}/watcher/${user.LoginId}`, {},
      {headers: this.headers}).map(res => {
      const message = `You have successfully subscribed for the task '${task.title}'`;
      /* task.watchers.forEach((watcher) => {
         this.notificationService.sendMessage(task, message, watcher);
       });*/
      this.toastService.sendToastMessage(message, 'TYPE_SUCCESS');
      return res;
    });
  }

}
