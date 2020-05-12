/* Module 7.3, Module 8.2, Module 8.7, Module 9.1 */

import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {select, settings, classNames} from './settings.js';
import { Booking } from './components/Booking.js';

export const app = {
  initMenu: function(){
    const thisApp = this;

    //console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products){ //tworzymy nową instancję dla każdego produktu.
      //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]); //po wywolaniu zapy. AJAX dodal. ID, Module 8.7
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {}; // {}; Module 8.7

    const url = settings.db.url + '/' + settings.db.product; // Module 8.7

    /* Module 8.7 */

    fetch(url) //wysyłamy zapytanie pod podany adres endpointu
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){  //po otrzymaniu skonwertowanej odpowiedzi parsedResponse, wyświetlamy ją w konsoli.
        //console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products, Module 8.7 */
        /* zapisz parsedResponse jako thisApp.data.products, moduł 8.7 */

        thisApp.data.products = parsedResponse;

        /* execute initMenu method, Module 8.7 */
        /* wykonaj metodę initMenu, moduł 8.7 */

        thisApp.initMenu();
      });

    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  /* Module 8.2 */

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    //console.log(cartElem);
    thisApp.cart = new Cart(cartElem);

    /* Module 9.1 */

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  /* Module 9.2 */

  initPages: function () {
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links)); 
    //thisApp.activatePage(thisApp.pages[0].id); //wywolanie metody, 0 - pierwsza strona z indeksem 0
    //kasujemy kod powyzej, aby Po odświeżeniu strony jednak wyświetla się ponownie menu z produktami.

    let pagesMatchingHash = [];

    if(window.location.hash.length > 2){
      const idFromHash = window.location.hash.replace('#/', ''); // odczytując hash i zamieniając w nim '#/' na pusty ciąg znaków ''

      pagesMatchingHash = thisApp.pages.filter(function (page){ //Ta metoda pozwala na przefiltrowanie tablicy za pomocą funkcji filtrującej, przekazanej jako argument.
        return page.id == idFromHash; //Ta metoda nie modyfikuje filtrowanej tablicy, tylko zwraca nową tablicę, zawierającą jedynie elementy spełniające warunek – czyli te, dla których funkcja filtrująca zwróciła prawdziwą wartość.
      });
    }
    
    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);
    //kod powyżej powoduje ,że po przełączeniu się na podstronę Booking, odświeżenie strony nie przełączy nas z powrotem na podstronę Order. Nie będziemy musieli klikać linka "Booking" po każdym odświeżeniu strony.

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* TODO: GET PAGE ID FROM HREF*/
        const pageId = clickedElement.getAttribute('href');
        const href = pageId.replace('#', '');
        /*  TODO: activate page */
        thisApp.activatePage(href);
      });
    }
  },

  /* Module 9.2 */

  activatePage: function(pageId){
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.nav.active, page.getAttribute('id') == pageId);
    }

    window.location.hash = '#/' + pageId;
  },

  /* Module 9.3 */

  initBooking: function(){
    const thisApp = this;
  
    const bookingContainer = document.querySelector(select.containerOf.booking);
    //console.log('booking container: ', bookingContainer);
    thisApp.booking = new Booking(bookingContainer);
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();
