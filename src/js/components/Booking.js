/* Module 9.3, Module 9.5, Module 9.6, Module 9.7 */

import {templates, select, settings, classNames} from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';
import { utils } from '../utils.js';

export class Booking {
  constructor(bookingContainer) {
    const thisBooking = this;

    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  /* Module 9.3, Module 9.5, Module 9.7 */

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
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  /* Module 9.3, Module 9.7 */

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }     
  
  /* Module 9.6 */

  getData(){
    const thisBooking = this;
  
    const startEndDates = {}; //tworzymy obiekt zawierający daty minDate i maxDate, ustawione w widgecie wyboru daty. To dobre źródło tych wartości, ponieważ potrzebujemy informacji tylko dla dat, które można wybrać w date-pickerze
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);
    //powyżej do uzyskania dat w postaci 2019-01-01 wykorzystaliśmy kolejną z przygotowanych przez nas funkcji pomocniczych – utils.dateToStr
  
    const endDate = {}; //tworzymy obiekt endDate, który zawiera wyłącznie datę końcową. Kluczami w obu tych obiektach są parametry zapisane w settings.db – czyli ciągi znaków 'date_lte' i 'date_gte'
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];
  
    const params = { //całość składamy w całość w obiekcie params
      booking: utils.queryParams(startEndDates), //utils.queryParams funkcja ta zamienia pary klucz-wartość z obiektu w ciąg znaków
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };
  
    //console.log('getData params', params);

    const urls = { //obiekt w którym zapiszemy pełne adresy zapytań
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };
    
    //console.log('getData urls', urls);

    Promise.all([ //metoda Promise.all działa podobnie jak fetch – z tą różnicą, że funkcja podłączona do niej za pomocą .then wykona się dopiero, kiedy wszystkie zapytania będą wykonane.
      fetch(urls.booking), //używamy Promise.all dwukrotnie. Najpierw z pomocą tej metody wysyłamy trzy zapytania pod przygotowane wcześniej adresy.
      fetch(urls.eventsCurrent), //dzięki zastosowaniu Promise.all, obie funkcje w metodach .then otrzymują jeden argument, który jest tablicą. Używamy tutaj skróconego zapisu, który pozwala nam nazwać poszczególne elementy tej tablicy od razu w deklaracji atrybutu.
      fetch(urls.eventsRepeat),
    ])
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]){
        return Promise.all([ //w pierwszym .then, ponownie używamy Promise.all, aby sparsować odpowiedzi wszystkich trzech zapytań.
          bookingsResponse.json(), 
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){ //Po przetworzeniu odpowiedzi z API na obiekty, przekazujemy je do metody thisBooking.parseData
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
    
  }

  /* Module 9.6, Module 9.7 */

  parseData(bookings, eventsCurrent, eventsRepeat){ // Agregacja danych źródłowych
    const thisBooking = this;

    thisBooking.booked = {};

    for(let event of eventsCurrent){
      //console.log('Event current:', event);
      thisBooking.makeBooked(event.date, event.hour, event.duration, event.table);
    }

    for (let event of bookings){
      //console.log('Booking:', event);
      thisBooking.makeBooked(event.date, event.hour, event.duration, event.table);
    }

    for(let event of eventsRepeat){
      //console.log('Event repeat: ', event);
      if(event.repeat == 'daily'){ // sprawdzamy czy element w tablicy jest "daily"
        for (let date = thisBooking.datePicker.minDate; date <= thisBooking.datePicker.maxDate; date = utils.addDays(date, 1)){
          thisBooking.makeBooked(utils.dateToStr(date), event.hour, event.duration, event.table);
        }
      }
    }
    console.log('Bookings: ', thisBooking.booked);
    
    thisBooking.updateDOM();
  }

  /* Module 9.6 */
  
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const bookedTime = utils.hourToNumber(hour);
    //console.log('booked time: ', bookedTime);

    for(let hourBlock = bookedTime; hourBlock < bookedTime + duration; hourBlock += 0.5){
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      for(let tableId = 0; tableId < table.length; tableId++){
        thisBooking.booked[date][hourBlock].push(table[tableId]);
        //console.log('adding table nr', table[tableId]);
      }
    }
    //console.log(thisBooking.booked[date]);
  }

  /* Module 9.7 */

  updateDOM(){
    const thisBooking = this;
    //console.log('updateDOM');

    thisBooking.date = thisBooking.datePicker.value;
    console.log('today is:', thisBooking.date);

    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    console.log(thisBooking.hour);
    console.log('thisBooking.date', thisBooking.date);

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      console.log('tableId is: ', tableId);
      console.log(thisBooking.date);
      if (
        (typeof thisBooking.booked[thisBooking.date] != 'undefined') && 
        (typeof thisBooking.booked[thisBooking.date][thisBooking.hour] != 'undefined') &&
        
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        
        table.classList.add(classNames.booking.tableBooked);
        console.log('table booked: ' + tableId);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        console.log('table available: ' + tableId);
      }
    } 
    console.log('Bookings: ', thisBooking.booked);
  }
}