import {Component} from '@angular/core';
import {Mode} from './model/mode.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  mode = Mode.Light;

  switchMode(mode) {
    if (mode === Mode.Light) {
      //replace from light to dark mode
      document.querySelector('body').style.setProperty('--bg-color', '#272727');
      document.querySelector('body').style.setProperty('--text-color', '#096d78');
      document.querySelector('body').style.setProperty('--secondary-light-color', 'white');
      document.querySelector('body').style.setProperty('--border-color', 'white');
      document.querySelector('body').style.setProperty('--primary-color', 'white');

      
      
      this.mode = Mode.Dark;
    } else {
      //replace from dark to light mode

      document.querySelector('body').style.setProperty('--bg-color', 'white');
      document.querySelector('body').style.setProperty('--text-color', 'rgb(6, 51, 106)');
      document.querySelector('body').style.setProperty('--secondary-light-color', 'red');
      document.querySelector('body').style.setProperty('--border-color', 'red');
      document.querySelector('body').style.setProperty('--primary-light-color', 'red');
      document.querySelector('body').style.setProperty('--primary-color', 'red');
      this.mode = Mode.Light;
    }
  }
}
