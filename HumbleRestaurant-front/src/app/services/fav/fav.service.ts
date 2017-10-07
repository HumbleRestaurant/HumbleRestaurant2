import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';
import {Http, Response, Headers} from '@angular/http';
import {Favorite} from '../../models/Favorite.model';

@Injectable()
export class FavService {
  constructor(private http: Http) { }

  searchFavs(search) {
    const favs = new BehaviorSubject<Favorite[]>([]);
    const headers = new Headers({'content-type' : 'application/json'});
    this.http.post('api/v1/favorites/query', search, headers)
      .toPromise()
      .then((res: Response) => {
        favs.next(res.json());
      })
      .catch(this.handleError);

    return favs.asObservable();
  }

  addFavs(fav: Favorite) {
    return this.http.post('api/v1/favorites', fav)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  deleteFavs(fav: Favorite) {
    return this.http.delete('api/v1/favorites/' + fav.userId + '/' + fav.ownerId)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
