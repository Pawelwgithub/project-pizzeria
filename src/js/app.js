/* Module 7.3, Module 8.2, Module 8.7, Module 9.1, Module 10.2 */

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

  /* Module 9.2, Module 10.2 */

  initPages: function(){
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    //console.log(thisApp.navLinks);
    thisApp.logoLink = document.querySelector(select.logo.link);
    //console.log(thisApp.logoLink);
    thisApp.activatePage(thisApp.pages[0].id);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        //console.log(clickedElement);
        event.preventDefault();
        let pageId = clickedElement.getAttribute('href');
        pageId = pageId.replace('#', '');
        //console.log('pageId is: ', pageId);
        thisApp.activatePage(pageId);
      });
    }

    thisApp.logoLink.addEventListener('click', function(event){
      const clickedElement = this;
      event.preventDefault();
      let pageId = clickedElement.getAttribute('href');
      pageId = pageId.replace('#', '');
      //console.log('pageId is: ', pageId);
      thisApp.activatePage(pageId);
    });
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

  /* Module 10.2 */

  initCarousel() {    // eslint-disable-next-line no-unused-vars

    const review = [];

    review[0] = {
      title: 'Delicious food',
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae quam suscipit, interdum arcu nec,',
      name: '- John Smith',
    };
    review[1] = {
      title: 'Amazing service!',
      text:
        'Aenean vitae quam suscipit, interdum arcu nec, lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      name: '- Margaret Osborne',
    };
    review[2] = {
      title: 'Great place',
      text: 'Mauris maximus ipsum sed!!!',
      name: '- Mark Miller',
    };
    let i = 0;
    //console.log(review[0]);

    const dots = document.querySelectorAll('.carousel-dots i');
    //console.log(dots);

    function changeSlide() {
      const title = document.querySelector('.review-title');
      const text = document.querySelector('.review-text');
      const name = document.querySelector('.review-name');

      for (let dot of dots) {
        if (dot.id == 'dot-'+ (i + 1)) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
        title.innerHTML = review[i].title;
        text.innerHTML = review[i].text;
        name.innerHTML = review[i].name;
      }

      if (i < review.length - 1) {
        i++;
      } else {
        i = 0;
      }
    }
    changeSlide();

    setInterval(() => {
      changeSlide();
    }, 3000);
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
    thisApp.initCarousel();
  },
};

app.init();
