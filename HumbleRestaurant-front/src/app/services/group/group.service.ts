import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';
import {Group} from '../../models/Group';

@Injectable()
export class GroupService {

  constructor(private http: Http) { }

  addGroup(group: Group) {
    return this.http.post('api/v1/groups', group)
      .toPromise()
      .catch(error => this.handleError(error));
  }

  searchGroups(search) {
    return  this.http.post('api/v1/groups/query', search)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  getGroup(ownerId: string) {
    return this.http.get('api/v1/groups/' + ownerId)
      .toPromise()
      .then((res: Response) => res.json()[0])
      .catch( error => this.handleError(error));
  }

  updateGroup(group: Group) {
    return this.http.put('api/v1/groups', group)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  getGroupUsers(ownerId: string) {
    return this.http.get('api/v1/group-users/' + ownerId)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  addGroupUser(user) {
    return this.http.post('api/v1/group-users', user)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  deleteGroupUser(ownerId: string, userId: string) {
    return this.http.delete('api/v1/group-users/' + ownerId + '/' + userId)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
