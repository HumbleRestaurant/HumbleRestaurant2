import { Injectable } from '@angular/core';
import {Rating} from '../../models/Rating.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';
import {Http, Response, Headers} from '@angular/http';

@Injectable()
export class RatingService {
  constructor(private http: Http) { }

  searchRatings(search: Search) {
    const ratings = new BehaviorSubject<Rating[]>([]);
    const headers = new Headers({'content-type' : 'application/json'});
    this.http.post('api/v1/ratings/query', search, headers)
      .toPromise()
      .then((res: Response) => {
        ratings.next(res.json());
      })
      .catch(this.handleError);

    return ratings.asObservable();
  }

  addRating(rating) {
    return this.http.post('api/v1/ratings', rating)
      .toPromise()
      .catch(error => this.handleError(error));
  }

  updateRating(rating) {
    return this.http.put('api/v1/ratings', rating)
      .toPromise()
      .catch(error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
