/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  /* Module 7.3 */

  class Product{
    constructor(id, data){
      const thisProduct = this;
      
      thisProduct.id = id;
      thisProduct.data = data;
      
      thisProduct.renderInMenu();
      //console.log('new Product:', thisProduct);
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template, Module 7.3 */
      /* generuj HTML na podstawie szablonu, moduł 7.3 */

      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML, Module 7.3 */
      /* utwórz element za pomocą utils.createElementFromHTML, moduł 7.3 */

      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      
      /* find menu container, Module 7.3 */
      /* znajdź kontener menu, moduł 7.3 */

      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu, Module 7.3 */
      /* dodaj element do menu, moduł 7.3 */
     
      menuContainer.appendChild(thisProduct.element);
    }

    /* Module 7.5, Module 7.6 */

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

    initOrderForm(){
      const thisProduct = this;
      console.log(this.initOrderForm);

      thisProduct.form.addEventListener('submit', function(event){
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
      });

    }

    /* Module 7.5, Module 7.6 */

    processOrder(){
      const thisProduct = this;
      console.log(this.processOrder);

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData, Module 7.5 */
      /* odczytaj wszystkie dane z formularza (używając utils.serializeFormToObject) i zapisz je w const formData */
      
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      /* Module 7.6 */

      thisProduct.params = {};

      /* set variable price to equal thisProduct.data.price, Module 7.5 */
      /* ustaw cenę zmienną na thisProduct.data.price */
      
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

          /* START IF: if option is selected, Module 7.6 */
          /* START JEŻELI: jeśli wybrana jest opcja, moduł 7.6 */

          if (optionSelected) {
            if (!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
          
            thisProduct.params[paramId].options[optionId] = option.label;

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
            
            /* START LOOP: for each  optionImage of all option images, Module 7.6 */
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

      /* set the contents of thisProduct.priceElem to be the value of variable price, Module 7.5 */
      /* ustaw zawartość thisProduct.priceElem na wartość zmiennej ceny */
      
      thisProduct.priceElem.innerHTML = price;
      //console.log(thisProduct.priceElem.innerHTML);
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    
    initData: function(){
      const thisApp = this;
  
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
