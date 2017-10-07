import { Injectable } from '@angular/core';
import {Restaurant} from '../../models/Restaurant.model';
import {Http, Response, Headers} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';

@Injectable()
export class RestaurantService {
  constructor(private http: Http) { }

  getRestaurant(ownerId: string) {
    return this.http.get('api/v1/restaurants/' + ownerId)
      .toPromise()
      .then((res: Response) => res.json()[0])
      .catch(this.handleError);
  }

  searchRestaurant(search: Search) {
    const restaurants = new BehaviorSubject<Restaurant[]>([]);

    const headers = new Headers({'content-type' : 'application/json'});
    this.http.post('api/v1/restaurants/query', search, headers)
      .toPromise()
      .then((res: Response) => {
        restaurants.next(res.json());
      })
      .catch(this.handleError);

    return restaurants.asObservable();
  }

  updateRestaurant(restaurant: Restaurant) {
    return this.http.put('api/v1/restaurants', restaurant)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  addRestaurant(ownerId: string) {
    return this.http.post('api/v1/restaurants', {name: '', ownerId: ownerId})
      .toPromise()
      .catch(error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
