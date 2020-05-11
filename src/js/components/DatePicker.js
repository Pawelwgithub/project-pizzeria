/* global flatpickr */

/* Module 9.5 */

import {BaseWidget} from './BaseWidget.js';
import { utils } from '../utils.js';
import { select, settings,  } from '../settings.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    //console.log(thisWidget.dom.input);
    
    thisWidget.initPlugin();
  }

  initPlugin() { //app. komp., która rozszerza funkcjon. przgłądarki 
    const thisWidget = this;
    
    thisWidget.minDate = new Date(thisWidget.value);  // tworzy obiekt daty, którego wartość to "teraz", czyli data i godzina w momencie wykonania tego kodu JS.
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    //aby uzyskać datę przesuniętą o ileś dni,

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function (date) {
          // return true to disable
          return date.getDay() === 1;
        },
      ],
      locale: {
        firstDayOfWeek: 1, // start week on Monday
      },
      onChange: function (dateStr) {
        thisWidget.value = dateStr;
      },
    });
  }

  parseValue(newValue){
    return newValue;
  }

  isValid(){
    return true;
  }

  renderValue(){ //nie będzie nam potrzebna – możesz ją stworzyć z pustą wartością, tylko po to, aby nadpisać domyślną metodę w BaseWidget
  }
}