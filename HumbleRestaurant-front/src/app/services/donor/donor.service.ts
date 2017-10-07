import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Donor} from '../../models/donor.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DonorService {

  constructor(private http: Http) { }

  getDonors (role: string, duration: string) {
    const donors = new BehaviorSubject<Donor[]>([]);
    this.http.get('api/v1/donors/' + role + '/' + duration)
      .toPromise()
      .then((res: Response) => {
        donors.next(res.json());
      })
      .catch(error => this.handleError(error));

    return donors.asObservable();
  }

  generateDonors (role: string, duration: string) {
    return this.http.get('api/v1/donors/generate/' + role + '/' + duration)
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  updateDonors(role: string, duration: string, donors: Donor[]) {
    return this.http.put('api/v1/donors',
      {role: role, duration: duration, donors: donors})
      .toPromise()
      .then((res: Response) => res.json())
      .catch( error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
