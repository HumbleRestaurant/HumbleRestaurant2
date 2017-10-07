import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';

@Injectable()
export class GeohashService {
  geomap: string[] = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ];
  constructor(private http: Http) { }

  getCoordinate(location: string) {

    const params = {
      address: location,
      key: 'AIzaSyD1Bnn60r9X04C24OjN_CLzwCg1cGJI70A'
    };

    if (location === null || location === '') {

      return this.http.get('https://ipinfo.io/geo')
        .toPromise()
        .then((res: Response) => {
          const result = res.json();
          const loc = result.loc.split(',');
          return {lat: +loc[0], lng: +loc[1]};
        })
        .catch(this.handleError);
    }else {

      return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?', {params: params})
        .toPromise()
        .then((res: Response) => {
          const result = res.json();
          return {lat: result.results[0].geometry.location.lat, lng: result.results[0].geometry.location.lng};
        })
        .catch(this.handleError);

    }
  }

  getGeoHash(lat: number, lng: number) {
    let lats = -90;
    let late = 90;
    let lngs = -180;
    let lnge = 180;

    const resLat: number[] = [];
    for (let i = 0; i < 25; i++) {
      const pivot = ( lats + late ) / 2;
      if (lat > pivot) {
        resLat.push(1);
        lats = pivot;
      } else {
        resLat.push(0);
        late = pivot;
      }
    }

    const resLng: number[] = [];
    for (let i = 0; i < 25; i++) {
      const pivot = ( lngs + lnge ) / 2;
      if (lng > pivot) {
        resLng.push(1);
        lngs = pivot;
      } else {
        resLng.push(0);
        lnge = pivot;
      }
    }

    const res: number[] = [];
    for (let i = 0; i < 25; i++) {
      res.push(resLat[i]);
      res.push(resLng[i]);
    }

    let geohash = '';
    for (let i = 0; i < 50; i += 5) {
      const pos = res[i] * 16 + res[i + 1] * 8 + res[i + 2] * 4 + res[i + 3] * 2 + res[i + 4];
      geohash += this.geomap[pos];
    }

    return geohash;
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
