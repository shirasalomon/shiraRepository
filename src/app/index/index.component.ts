import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {ADD_FAV, DEFAULT_LAT, DEFAULT_LNG, REMOVE_FAV} from '../app.consts';
import {GeoPositionRes} from '../model/geo-position';
import {DailyForecast, FiveDaysForecast} from '../model/5-days-forecast';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap, takeUntil} from 'rxjs/operators';
import {AutoCompleteSuggestions} from '../model/auto-complete-suggestions';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  autoCompleteCityInput = new Subject();
  autoCompleteCityValue;
  autoCompletedCitiesSuggestions: AutoCompleteSuggestions[];
  cityName: string;
  headLine: string;
  forecasts: DailyForecast[];
  favoritesState;
  selectedKey: any;

  constructor(protected appService: AppService, protected weatherService: WeatherService) {
  }

  ngUnSubscribe: Subject<void> = new Subject<void>();

  ngOnInit() {
    debugger;
    if (navigator.geolocation) {
    //get auto user location
      
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        this.appService.getGeoPosition(latitude, longitude).subscribe((data: GeoPositionRes) => {
          this.handleInitPosition(data);
        });
      });
    } else {
      //defualt value tel-aviv

      this.appService.getGeoPosition(DEFAULT_LAT, DEFAULT_LNG).subscribe((data: GeoPositionRes) => {
        this.handleInitPosition(data);
      });
    }

//get all autocomplete locations
    this.autoCompleteCityInput
      .pipe(
        filter((data: string) => data.length > 0),
        takeUntil(this.ngUnSubscribe),
        debounceTime(300),
        switchMap((data: string) => {
          return this.appService.getAutoComplete(data);
        })
      )
      .subscribe((suggestions: AutoCompleteSuggestions[]) => {
        this.autoCompletedCitiesSuggestions = suggestions;
      });
  }

//get data from state
  private getFavState(Key: string) {
    const storeState = this.weatherService.get();
    return storeState[Key] ? REMOVE_FAV : ADD_FAV;
  }
//select city from autocomplete cities options
  selectSuggestion(suggestion: AutoCompleteSuggestions) {
    this.favoritesState          = this.getFavState(suggestion.Key);
    this.cityName          = `${suggestion.LocalizedName},${suggestion.Country.LocalizedName}`;
    this.autoCompleteValue = this.cityName;

    this.getFiveDays(suggestion.Key);
    this.autoCompletedCitiesSuggestions = null;
  }

//init state and call to 5 days forcast function
  private handleInitPosition(geoPositionRes: GeoPositionRes) {
    this.favoritesState    = this.getFavState(geoPositionRes.Key);
    this.cityName    = `${geoPositionRes.ParentCity.EnglishName},${geoPositionRes.Country.EnglishName}`;
    this.getFiveDays(geoPositionRes.Key);
  }


  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }

//weather forcast for 5 days
  getFiveDays(key) {
    this.selectedKey = key;
    this.appService.get5DaysOfForecasts(key).subscribe((fiveDaysForecastData: FiveDaysForecast) => {
      this.headLine  = fiveDaysForecastData.Headline.Text;
      this.forecasts = fiveDaysForecastData.DailyForecasts;
    });
  }

//add or remove location to favorites
  toggleFavorites() {
    const faveState = this.getFavState(this.selectedKey);
    const selectedCity = {
      key: this.selectedKey,
      cityName: this.cityName
    };
    if (faveState === ADD_FAV) {
      this.weatherService.add(selectedCity);
    } else {
      this.weatherService.remove(selectedCity);
    }

    this.favoritesState = faveState === ADD_FAV ? REMOVE_FAV : ADD_FAV;


  }
}
