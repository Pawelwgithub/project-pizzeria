/* Module 9.3 */

import {templates, select} from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';

export class Booking {
  constructor(bookingContainer) {
    const thisBooking = this;

    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
  }

  /* Module 9.3, Module 9.5 */

  render(bookingContainer){
    const thisBooking = this;
    
    const generatedHTML = templates.bookingWidget();
    //console.log('generatedHTML is: ', generatedHTML);
    thisBooking.dom = {};
    
    thisBooking.dom.wrapper = bookingContainer;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }

  /* Module 9.3 */

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }      
}