/* Module 8.2, Module 8.4, Module 9.1 */

import {select, classNames, templates, settings} from '../settings.js';
import {utils} from '../utils.js';
import {CartProduct} from './CartProduct.js';

export class Cart {
  constructor(element){
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee; // Module 8.4 cena bedzie stala

    thisCart.products = [];

    thisCart.getElements(element);

    //console.log('new Cart', thisCart);

    thisCart.initActions();
  }

  /* Module 8.2, Module 8.3, Module 8.4, Module 8.8 */

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    /* Module 8.8 */

    //thisCart.dom.form = document.querySelector(select.cart.form);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    //console.log(thisCart.dom.form);

    //thisCart.dom.phone = document.querySelector(select.cart.phone);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    //console.log(thisCart.dom.phone);

    //thisCart.dom.address = document.querySelector(select.cart.address);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    //console.log(thisCart.dom.address);

    /* Module 8.4 */
    /*Tworzymy tutaj tablicę, która zawiera cztery stringi (ciągi znaków).
        Każdy z nich jest kluczem w obiekcie select.cart.
        Wykorzystamy tę tablicę, aby szybko stworzyć cztery właściwości obiektu thisCart.dom o tych samych kluczach.
        Każda z nich będzie zawierać kolekcję elementów znalezionych za pomocą odpowiedniego selektora. */

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee']; //do wyswietlania aktualnych sum

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  /* Module 8.2, Module 8.4, Module 8.5, Module 8.8 */

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    /* Module 8.4 */
    /* Nasłuchujemy tutaj na liście produktów, w której umieszczamy produkty,
        w których znajduje się widget liczby sztuk, który generuje ten event.
        Dzięki właściwości bubbles "usłyszymy" go na tej liście i możemy wtedy wykonać metodę update */

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    /* Module 8.5 */

    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);  //handler eventu, wywolujący metody remove
    });

    /* Module 8.8 */

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
      console.log('Order sent!');
      alert('Order was successfully sent!');
    });
  }

  /* Module 8.8 */

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order; //adres endpointu. kontaktojemy sie z endpointem zamowenie(order)

    const payload = { //ladunek- czyli tak określa się dane, które będą wysłane do serwera
      //address: 'test',
      //address: thisCart.dom.address,
      //phone: thisCart.dom.phone,
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    /* Module 8.8 */
    /* Pętla iterującą po wszystkich thisCart.products, i dla każdego produktu wywołaj jego metodę getData.
        Wynik zwracany przez tą metodą dodaj do tablicy payload.products */

    //for(let singleProduct of thisCart.products){
    //  const orderedProduct = singleProduct.getData;
    //  payload.products.push(orderedProduct);
    //push - Dodaje jeden lub więcej elementów na koniec tablicy i zwraca jej nową długość. Metoda ta zmienia długość tablicy.

    for(let product of thisCart.products){
      product.getData();
      payload.products.push(product);
    }

    /* Module 8.8 */

    const options = { //opcje, które skonfigurują zapytanie
      method: 'POST', //metoda POST służy do wysyłania nowych danych do API
      headers: { //musimy ustawić nagłówek, aby nasz serwer wiedział, że wysyłamy dane w postaci JSONa
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), //nagłówek body, czyli treść którą wysyłamy. Używamy tutaj metody JSON.stringify, aby przekonwertować obiekt payload na ciąg znaków w formacie JSON.
    };

    /* Module 8.8 */

    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });

    thisCart.reset();
  }

  /* Module 8.3, Module 8.4 */

  add(menuProduct){ //dodaje produkt do koszyka , menuProdukt - instancja produktu
    const thisCart = this;
    //console.log('adding product', menuProduct);

    /* generate HTML based on template, Module 8.3 - czyli generuje kod HTML pojedynczego produktu */

    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log('generatedHTML', generatedHTML);

    /* create element using utils.createElementFromHTML, Module 8.3 - tworzenie elementu DOM */

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //console.log('generatedDOM', generatedDOM);

    /* add elements generatedDOM to menu thisCart.dom.productList, Module 8.3 - dodajemy wygenerowane elementy DOM produktu do menu thisCart.dom.productList za pomocą metody appendChils */

    thisCart.dom.productList.appendChild(generatedDOM);
    //console.log('thisCart.dom.productList', thisCart.dom.productList);

    /* Module 8.4 */
    //push - Dodaje jeden lub więcej elementów na koniec tablicy i zwraca jej nową długość. Metoda ta zmienia długość tablicy.
    //jednocześnie stworzymy nową instancję klasy new CartProduct oraz dodamyją do tablicy thisCart.products

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products', thisCart.products);

    /* Module 8.4 */

    thisCart.update();
  }

  /* Module 8.4 */

  update(){
    const thisCart = this;

    thisCart.totalNumber = 0; //wlasciwosc instancji koszyka
    thisCart.subtotalPrice = 0;

    for(let  thisCartProduct of thisCart.products ) { //uzyj pętli for...of, iterującej po thisCart.products
      thisCart.subtotalPrice = thisCart.subtotalPrice + thisCartProduct.price; //suma cen pozycji w koszyku,
      thisCart.totalNumber = thisCart.totalNumber + thisCartProduct.amount; //zwiekszyc o liczbe produktów
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee; //cena ostateczna
    console.log('total numer', thisCart.totalNumber);
    console.log(thisCart.subtotalPrice);
    console.log(thisCart.totalPrice);

    /* Module 8.5 */

    //if(thisCart.subtotalPrice == 0){ //usuwanie ceny dostawy po usunięciu wszystkich produktów z koszyka
    //  thisCart.totalPrice = 0;
    //  thisCart.deliveryFee = 0;
    //}else{
    //  thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    //}

    //if(thisCart.products.length > 0){
    //  thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    //}else{
    //  thisCart.totalPrice = 0;
    //  thisCart.deliveryFee = 0;
    //}

    if(thisCart.totalNumber == 0){ //usuwanie ceny dostawy po usunięciu wszystkich produktów z koszyka
      thisCart.subtotalPrice = 0;
      thisCart.deliveryFee = 0;
      thisCart.totalPrice = 0;
    }else{
      //thisCart.deliveryFee = 20;
      thisCart.deliveryFee;
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    }

    /* Module 8.4 */

    for(let key of thisCart.renderTotalsKeys) { //wyswietlenie aktualnych cen
      for(let elem of thisCart.dom[key]) { //pętlę iterującą po każdym elemencie z kolekcji, zapisanej wcześniej pod jednym z kluczy w thisCart.renderTotalsKeys
        elem.innerHTML = thisCart[key]; //???
        //Dla każdego z tych elementów ustawiamy właściwość koszyka, która ma taki sam klucz.
      }
    }
  }

  /* Module 8.5 */

  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    //Kiedy chcemy sprawdzić, jaki indeks ma pewna konkretna wartość, możemy to zrobić za pomocą metody indexOf
    thisCart.products.splice(index, 1);//usuwanie elementu z tablicy,
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

  /* Module 8.8 */
  
  reset() {
    const thisCart = this;
    thisCart.products = [];
    thisCart.dom.productList.innerHTML = '';

    thisCart.update();

    thisCart.dom.phone.value = '';
    thisCart.dom.address.value = '';
  }
}
