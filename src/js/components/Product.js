/* Module 7.3, Module 7.4, Module 7.5, Module 7.6, Module 7.7, Module 9.1 */

import { select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';
import {app} from '../app.js';

export class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    //console.log('new Product:', thisProduct);
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu(){ //renderuje czyli tworzy produkty na stronie
    const thisProduct = this;

    /* generate HTML based on template, Module 7.3 */
    /* generuj HTML na podstawie szablonu czyli generuje kod HTML pojedynczego produktu, moduł 7.3 */

    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML, Module 7.3 */
    /* utwórz element za pomocą utils.createElementFromHTML - tworzenie elementu DOM, moduł 7.3 */

    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container, Module 7.3 */
    /* znajdź kontener menu, moduł 7.3, znajdujemy kontener menu,którego selektor mamy zapisany w select.containerOf.menu. */

    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu, Module 7.3 */
    /* dodaj element do menu, moduł 7.3, dodajemy stworzony element do menu za pomocą metody appendChils */

    menuContainer.appendChild(thisProduct.element);
  }

  /* Module 7.5, Module 7.6, Module 7.7 */

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    //console.log(thisProduct.accordionTrigger);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    //console.log(thisProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    //console.log(thisProduct.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    //console.log(thisProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    //console.log(thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    //console.log(thisProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    //console.log(thisProduct.amountWidgetElem);
  }

  /* Module 7.4 */

  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking), Module 7.4 */
    /* znajdź klikalny wyzwalacz (element, który powinien zareagować na kliknięcie), moduł 7.4 */

    //const clicableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    //console.log(clicableTrigger);

    /* START: click event listener to trigger, Module 7.4 */
    /* START: kliknij detektor zdarzeń, aby uruchomić moduł 7.4 */

    thisProduct.accordionTrigger.addEventListener('click', function(event){

      /* prevent default action for event, Module 7.4 */
      /* zapobiega domyślnej akcji dla zdarzenia, moduł 7.4 */

      event.preventDefault();

      /* toggle active class on element of thisProduct, Module 7.4 */
      /* przełącza aktywną klasę na element tego produktu, moduł 7.4 */

      thisProduct.element.classList.toggle('active');

      /* find all active products, Module 7.4 */
      /* znajdź wszystkie aktywne produkty, moduł 7.4 */

      const allActiveProducts = document.querySelectorAll('article.active');

      /* START LOOP: for each active product, Module 7.4 */
      /* PĘTLA STARTOWA: dla każdego aktywnego produktu, moduł 7.4 */

      for(let activeProduct of allActiveProducts ){

        /* START: if the active product isn't the element of thisProduct, Module 7.4 */
        /* START: jeśli aktywny produkt nie jest elementem tego produktu, moduł 7.4 */

        if( activeProduct !== thisProduct.element){

          /* remove class active for the active product, Module 7.4 */
          /* usuń klasę aktywną dla aktywnego produktu, moduł 7.4 */

          activeProduct.classList.remove('active');
          //console.log(activeProduct);

          /* END: if the active product isn't the element of thisProduct, Module 7.4 */
          /* END: jeśli aktywny produkt nie jest elementem tego produktu, moduł 7.4 */

        }

        /* END LOOP: for each active product, Module 7.4 */
        /* PĘTLA KOŃCOWA: dla każdego aktywnego produktu, moduł 7.4 */

      }

      /* END: click event listener to trigger, Module 7.4 */
      /* END: kliknij detektor zdarzeń, aby uruchomić moduł 7.4 */

    });
  }

  /* Module 7.5 */

  initOrderForm(){ //Event listenery dla formularza
    const thisProduct = this;
    //console.log(this.initOrderForm);

    thisProduct.form.addEventListener('submit', function(event){ //?? dlaczego tutaj dodajemy event, a ponizej nie?
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  /* Module 7.5, Module 7.6, Module 7.7 */

  processOrder(){
    const thisProduct = this;
    //console.log(this.processOrder);

    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData, Module 7.5 */
    /* odczytaj wszystkie dane z formularza (używając utils.serializeFormToObject) i zapisz je w const formData */

    const formData = utils.serializeFormToObject(thisProduct.form); //odczyt wartosci wybranych
    //console.log('formData', formData);

    /* Module 8.3 */

    thisProduct.params = {}; //?? pusty obiekt {} do właściwości thisProduct.params, wybrane opcje zapiszemy w nowym obiekcie thisProduct.params, dlaczego tutaj dodajemy, dopiero teraz?

    /* set variable price to equal thisProduct.data.price, Module 7.5 */
    /* ustaw cenę zmienną na thisProduct.data.price, obliczamy cene */

    let price = thisProduct.data.price;
    //console.log(price);

    /* START LOOP: for each paramId in thisProduct.data.params, Module 7.5 */
    /* POCZĄTEK PĘTLI: dla każdej paramId w thisProduct.data.params */

    for (let paramId in thisProduct.data.params) {

      /* save the element in thisProduct.data.params with key paramId as const param, Module 7.5 */
      /* zapisz element w thisProduct.data.params z kluczem paramId jako const param */

      const param = thisProduct.data.params[paramId];
      //console.log(param);

      /* START LOOP: for each optionId in param.options, Module 7.5 */
      /* POCZĄTEK PĘTLI: dla każdej optionId w param.options */

      for (let optionId in param.options) {

        /* save the element in param.options with key optionId as const option, Module 7.5 */
        /* zapisz element w param.options z kluczem optionId jako const option */

        const option = param.options[optionId];
        //console.log(option);

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        //console.log(optionSelected);

        /* START IF: if option is selected and option is not default, Module 7.5 */
        /* ROZPOCZNIJ JEŚLI: jeśli opcja jest wybrana, a opcja nie jest domyślna */

        if(optionSelected && !option.default){

          /* add price of option to variable price, Module 7.5 */
          /* dodaj cenę opcji do ceny zmiennej */

          price = price + option.price;

          /* END IF: if option is selected and option is not default, Module 7.5 */
          /* KONIEC JEŻELI: jeśli opcja jest zaznaczona, a opcja nie jest domyślna */
        }

        /* START ELSE IF: if option is not selected and option is default, Module 7.5 */
        /* ROZPOCZNIJ JESZCZE JEŚLI: jeśli opcja nie jest wybrana, a opcja jest domyślna */

        else if (!optionSelected && option.default) {

          /* deduct price of option from price, Module 7.5 */
          /* odjąć cenę opcji od ceny */

          price = price - option.price;

          /* END ELSE IF: if option is not selected and option is default, Module 7.5 */
          /* ZAKOŃCZ JESZCZE JEŚLI: jeśli opcja nie jest zaznaczona, a opcja jest domyślna */
        }

        /* find all images of selected options, Module 7.6 */
        /* znajdź wszystkie zdjęcia wybranych opcji, moduł 7.6 */

        const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

        /* START IF: if option is selected, Module 7.6, Module 8.3 */
        /* START JEŻELI: jeśli wybrana jest opcja, moduł 7.6, moduł 8.3 */

        if (optionSelected){

          /* Module 8.3, podwójna pętla – zewnętrzna iteruje po parametrach, a wewnętrzna po ich opcjach.
            Dlatego ten kod może wykonać się dla pewnego parametru kilka razy.
            Dlatego sprawdzamy, czy ten parametr został już dodany do thisProduct.params.
            Jeśli nie, to pod jego kluczem dodajemy jego label oraz pusty obiekt options.
            Następnie do wspomnianego obiektu options dodajemy zaznaczoną opcję, używając jej klucza,
            a jako wartość ustawiając jej label */

          if (!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          //console.log(thisProduct.params);

          /* START LOOP: for each optionImage of all option images, Module 7.6 */
          /* PĘTLA STARTOWA: dla każdej optionImage wszystkich opcji obrazów, moduł 7.6 */

          for (let optionImage of optionImages) {

            /* add class active for images of selected options, Module 7.6 */
            /* dodaj klasę aktywną dla obrazów wybranych opcji, Moduł 7.6 */

            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
        }

        /* START ELSE : if option is not selected, Module 7.6 */
        /* START ELSE: jeżeli opcja nie jest zaznaczona, moduł 7.6 */

        else {

          /* START LOOP: for each optionImage of all option images, Module 7.6 */
          /* PĘTLA STARTOWA: dla każdej optionImage wszystkich opcji obrazów, moduł 7.6 */

          for (let optionImage of optionImages) {

            /* remove class active for the active image, Module 7.6 */
            /* usuń klasę aktywną dla aktywnego obrazu, moduł 7.6 */

            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

        /* END LOOP: for each optionId in param.options, Module 7.5 */
        /* KONIEC PĘTLI: dla każdej optionId w param.options */
      }

      /* END LOOP: for each paramId in thisProduct.data.params, Module 7.5 */
      /* KONIEC PĘTLI: dla każdej paramId w thisProduct.data.params */
    }

    /* multiply price by amount, Module 7.7, Module 8.3  */
    /* pomnóż cenę przez kwotę- ilość sztuk, moduł 7.7, moduł 8.3 */

    //price *= thisProduct.amountWidget.value;

    thisProduct.priceSingle = price; //cena jednej sztuki
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value; //cena całkowita

    /* set the contents of thisProduct.priceElem to be the value of variable price, Module 7.5, Module 8.3 */
    /* ustaw zawartość thisProduct.priceElem na wartość zmiennej ceny */

    //thisProduct.priceElem.innerHTML = price;
    //console.log(thisProduct.priceElem.innerHTML);

    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log('thisProduct', thisProduct);
  }

  /* Module 7.7 */

  initAmountWidget(){ //tworzy instancję klasy AmountWidget i zapisuje ją we właściwości produktu
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    // console.log(thisProduct.amountWidget);

    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  /* Module 8.3 */

  addToCart(){ //przekazuje całą instancję jako argument metody app.cart.add.
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    app.cart.add(thisProduct); //odwolanie do cart.add

    /* Module 9.1 */

    const event = new CustomEvent('add-to-cart', {
      bubles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}
