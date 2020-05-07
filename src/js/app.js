/* Module 7.3, Module 8.2, Module 8.7, Module 9.1 */

import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {select, settings} from './settings.js';

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
        console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products, Module 8.7 */
        /* zapisz parsedResponse jako thisApp.data.products, moduł 8.7 */

        thisApp.data.products = parsedResponse;

        /* execute initMenu method, Module 8.7 */
        /* wykonaj metodę initMenu, moduł 8.7 */

        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  /* Module 8.2 */

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    //console.log(cartElem);
    thisApp.cart = new Cart(cartElem);

    /* Module 9.1 */

    //thisApp.productList = document.querySelector(select.containerOf.menu);

    //thisApp.productList.addEventListener('add-to-cart', function(event){
    //  app.cart.add(event.detail.product);
    //});
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData();
    thisApp.initCart();
  },
};

app.init();
