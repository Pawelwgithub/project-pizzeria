/* Module 7.7, Module 9.1, Module 9.4 */

import {select, settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

/* Module 9.4 */

//export class AmountWidget{
//constructor(element){

export class AmountWidget extends BaseWidget{ //dodaliśmy informację, że jest ona rozszerzeniem klasy BaseWidget
  constructor(wrapper){ //otrzymuje odniesienie do elementu, w którym widget ma zostać zainicjowany
    super(wrapper, settings.amountWidget.defaultValue); //wywołania funkcji super. Pod tą nazwą kryje się konstruktor klasy BaseWidget. Właśnie dlatego podaliśmy mu dwa argumenty: element który jest wrapperem widgetu, oraz domyślną wartość odczytaną z obiektu settings.
    
    const thisWidget = this;

    thisWidget.getElements();
    //thisWidget.value = settings.amountWidget.defaultValue; //!! w związku z walidacją-sprawdzaniem poprawności zmiany ilości dodatkowo, musimy nadać pierwotną wartość thisWidget.value, na wypadek gdyby value w kodzie HTML nie zostało podane
    //thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  /* Module 7.7 */

  getElements(){
    const thisWidget = this;

    //thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  /* Module 7.7 */

  // NIE POTRZEBUJEMY setValue(value), poniewaz mamy basewidget 
  //setValue(value){
  //const thisWidget = this;

  //const newValue = parseInt(value);

  /* TODO: Add validation, Module 7.7 */
  /* DO ZROBIENIA: Dodaj sprawdzanie poprawności, moduł 7.7 */
  /* !! walidacja-sprawdzanie poprawności zmiany ilości, dzięki której zmiana ilości wykona się tylko jeżeli nowa wartość jest:
        - inna niż dotychczasowa,
        - większa lub równa niż wartość settings.amountWidget.defaultMin,
        - mniejsza lub równa niż wartość settings.amountWidget.defaultMax, moduł 7.7 !! */

  //if(newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax ){

  //thisWidget.value = newValue;
  //thisWidget.announce();
  //}

  //thisWidget.input.value = thisWidget.value;
  //}

  /* Module 9.4 */

  isValid(newValue){
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }

  /* Module 7.7 */

  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function(){
      //thisWidget.setValue(thisWidget.input.value);
      thisWidget.value = thisWidget.dom.input.value; // Module 9.4
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      //thisWidget.setValue(thisWidget.value - 1);
      thisWidget.value = parseInt(thisWidget.dom.input.value) - 1; // Module 9.4
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      //thisWidget.setValue(thisWidget.value + 1);
      thisWidget.value = parseInt(thisWidget.dom.input.value) + 1; // Module 9.4
    });
  }

  /* Module 9.4 */
  
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  /* Module 7.7, Module 8.4, Module 9.4 */

  // ANNOUNCE nie będzie nam już potrzebna, ponieważ zostanie "dostarczona" przez klasę BaseWidget

  //announce(){ //będzie ona tworzyła instancje klasy Event. Następnie, ten event zostanie wywołany na kontenerze naszego widgetu
  //const thisWidget = this;

  //const event = new Event('updated');

  /* Module 8.4 */
  /* Używamy tutaj innego rodzaju eventu, którego właściwości możemy kontrolować.
        W tym wypadku włączamy jego właściwość bubbles, dzięki czemu ten event po wykonaniu na jakimś elemencie
        będzie przekazany jego rodzicowi, oraz rodzicowi rodzica, i tak dalej – aż do samego <body>, document i window */

  //const event = new CustomEvent('updated', { bubbles: true }); //custom dod. custom dla Aktualizacja sum po zmianie ilości
  //włączamy właściwość bubbles, dzięki czemu event po wykonaniu na jakimś elemencie będzie przekazany jego rodzicowi, oraz rodzicowi rodzica
        
  //thisWidget.element.dispatchEvent(event); //wywołuje zdarzenie w bieżącym elemencie
  //}
}