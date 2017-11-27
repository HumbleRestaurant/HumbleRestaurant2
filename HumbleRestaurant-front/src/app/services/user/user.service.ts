import { Injectable } from '@angular/core';
import {User} from '../../models/User.model';
import {Restaurant} from '../../models/Restaurant.model';
import {Http, Response, Headers} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  searchUsers(search: Search) {
    const users = new BehaviorSubject<User[]>([]);
    const headers = new Headers({'content-type' : 'application/json'});
    this.http.post('api/v1/users/query', search, headers)
      .toPromise()
      .then((res: Response) => {
        users.next(res.json());
      })
      .catch(error => this.handleError(error));

    return users.asObservable();
  }

  addUser(userId: string, email: string) {
    this.http.post('api/v1/users', {userId: userId, email: email, name: email})
      .toPromise()
      .catch(error => this.handleError(error));
  }

  getUser(userId: string) {
    return this.http.get('api/v1/users/' + userId)
      .toPromise()
      .then((res: Response) => res.json()[0])
      .catch( error => this.handleError(error));
  }

  getUserGroups(userId: string) {
    return this.http.get('api/v1/users/' + userId + '/groups')
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  updateUser(user: User) {
    return this.http.put('api/v1/users', user)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
