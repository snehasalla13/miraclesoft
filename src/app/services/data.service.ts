import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Task} from '../model/task.model';

@Injectable()
export class DataService {

  _sidebarVal = false;

  private _dashboard = new BehaviorSubject<boolean>(true);
  _dashboardVal = this._dashboard.asObservable();

  private _userConfig = new BehaviorSubject({});
  _sidebarConfig = this._userConfig.asObservable();

  _searchStatus = new BehaviorSubject('SEARCH_FRESH');

  _searchResults = new BehaviorSubject<Task[]>([]);
  _notification = new BehaviorSubject(null);

  _assignedTasksFromService = new BehaviorSubject<Task[]>([]);
  _watchingTasksFromService = new BehaviorSubject<Task[]>([]);
  _completedTasksFromService = new BehaviorSubject<Task[]>([]);
  _restTasksFromService = new BehaviorSubject<Task[]>([]);

  _errorObject = new BehaviorSubject(null);

}
