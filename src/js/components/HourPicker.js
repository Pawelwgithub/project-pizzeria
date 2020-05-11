/* global rangeSlider */

/* Module 9.5 */

import { BaseWidget } from './BaseWidget.js';
import { select, settings } from '../settings.js';
import { utils } from '../utils.js';

export class HourPicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    //console.log(thisWidget.dom.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    //console.log(thisWidget.dom.output);
    
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }

  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  parseValue(newValue) {
    return utils.numberToHour(newValue); //a funkcja zamienia liczby na zapis godzinowy, czyli np. 12 na '12:00'
  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}