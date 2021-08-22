import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_KEY} from './app.consts';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {


  constructor(protected http: HttpClient) {
  }



  getRequest(url, q?) {
    const params = new HttpParams({fromObject: {apikey: API_KEY, q, metric: 'true'}});
    return this.http.get(url, {params});

  }

//get auto user location
  getGeoPosition(lat: number, lng: number): Observable<any> {
    const url = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search`;
    return this.getRequest(url, `${lat},${lng}`);
  }
//get auto complete locations
  getAutoComplete(key: string): Observable<any> {
    const url = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete`;
    return this.getRequest(url, `${key}`);
  }
//get five days forcast
  get5DaysOfForecasts(key: string): Observable<any> {
    const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}`;
    return this.getRequest(url);
  }

//Get Current Conditions data for a specific location.
  getCurrentConditions(key: string): Observable<any> {
    const url = `https://dataservice.accuweather.com/currentconditions/v1/${key}`;
    return this.getRequest(url);
  }
}
