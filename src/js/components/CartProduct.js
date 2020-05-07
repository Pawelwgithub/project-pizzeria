/* Module 8.4, Module 9.1 */

import {select} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';

export class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params)); /* deep copy,
        klonujemy obiekt, aby zachować kopię jego aktualnych wartości,
        klonuje-kopiuje obiekty na wszystkich poziomach
        – również obiekty zapisane we właściwościach klonowanego obiektu. */

    thisCartProduct.getElements(element);
    //console.log('new CartProduct', thisCartProduct);
    //console.log('productData', menuProduct);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
  }

  /* Module 8.4 */

  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }

  /* Module 8.4 */

  initAmountWidget(){ //tworzy instancję klasy AmountWidget i zapisuje ją we właściwości produktu
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
    //console.log(thisProduct.amountWidget);

    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }

  /* Module 8.5 */

  remove() { //usuwanie produktu z koszyka
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: { //przekazujemy odwołanie do tej instancji, dla której kliknięto guzik usuwania.
        cartProduct: thisCartProduct,
      }
    });
    console.log(event);

    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  /* Module 8.5 */

  initActions(){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });

    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();
    });
  }

  /* Module 8.8 */
  /* Metoda, która będzie zwracać wszystkie informacje o zamawianym produkcie –
        id, amount, price, priceSingle oraz params.
        Wszystkie te wartości są ustawiane w konstruktorze,
        więc nie powinno być problemu ze zwróceniem ich ("zapakowanych" w obiekt) z metody getData */

  getData(){ //wszystko zebrane w jednym obiekcie
    const thisCartProduct = this;

    const productData = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      params: thisCartProduct.params,
    };
    console.log('product data:', productData);
    return productData;
  }
}
