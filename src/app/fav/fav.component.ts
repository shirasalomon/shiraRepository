import {Component, OnInit} from '@angular/core';
import {WeatherService} from '../weather.service';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {AppService} from '../app.service';
import {CurrentConditions} from '../model/current-conditions';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.component.html',
  styleUrls: ['./fav.component.scss']
})
export class FavComponent implements OnInit {

  constructor(protected weatherService: WeatherService, protected appService: AppService) {
  }

  ngUnSubscribe: Subject<void> = new Subject<void>();

  favArr = [];

  ngOnInit() {
    this.weatherService.stateChanged
      .pipe(
        takeUntil(this.ngUnSubscribe),
        filter(state => state !== null)
      )
      .subscribe(state => {
        Object.keys(state).map((key) => {
          this.favArr.push(state[key]);
        });
      });
  }

}
