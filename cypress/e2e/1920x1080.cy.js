/* eslint-disable no-unused-vars */
/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
import { faker } from '@faker-js/faker'
Cypress.config('pageLoadTimeout', 100000)

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

Cypress.Commands.add('clickOutside', function() {
  return cy.get('body').click(0,0); //0,0 here are the x and y coordinates
});

describe('Элементы интерфейса', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('По кнопке "Каталог" открывается меню с разделами', () => {
    cy.get('.header__catalog__btn').click()
    cy.get('.header__catalog__menu_scroll_wrap').should('exist')
    cy.get('.header__catalog__menu').should('exist')
  })

  it('При наведении на разделы открываются списки подразделов', () => {
    cy.get('.header__catalog__btn').click()
    cy.get('.razdel_name').eq(0).trigger('mouseover')
    cy.get('.header__catalog__submenu').should('exist')
  })

  it('При выборе подразделов открывается каталог с соответствующими фильтрами', () => {
    cy.get('.header__catalog__btn').click()
    cy.get('.razdel_name').eq(0).trigger('mouseover')
    cy.get('.col-3').eq(0).children().eq(1).children().children().eq(0).children().eq(0)
      .invoke('attr', 'href').as('endpoint')
    cy.get('.col-3').eq(0).children().eq(1).children().children().eq(0).children().eq(0).click({ force: true })
    cy.get('@endpoint').then((endpoint) => {
      cy.url().should('contain', endpoint)
    })
  })

  it('Успешная отправка формы с заполненными полями из хедера', () => {
    const fakeValidPhone = faker.phone.number('792########')

    cy.get('.header__callback_btn').click()

    cy.get('.client_name').eq(0).type('ТЕСТ ' + faker.name.firstName())
    cy.get('.client_phone').eq(0).type(fakeValidPhone)
    cy.get('#button-call').click()

    cy.get('.noty_body').should('contain', 'Заявка успешно отправлена')
  })

  it('Успешная отправка формы с заполненными полями из футера', () => {
    const fakeValidPhone = faker.phone.number('792########')

    cy.get('.btn.btn-blue.modal-open').click()

    cy.get('.client_name').eq(0).clear()
    cy.get('.client_name').eq(0).type('ТЕСТ ' + faker.name.firstName())
    cy.get('.client_phone').eq(0).clear()
    cy.get('.client_phone').eq(0).type(fakeValidPhone)
    cy.get('#button-call').click()

    cy.get('.noty_body').should('contain', 'Заявка успешно отправлена')
  })

  it('Открытие всплывающего окна при нажатии на поисковую строку', () => {
    cy.get('#edit-search-theme-form-1').click()
    cy.get('#digi-shield').should('exist')
  })

  it('Закрытие поискового окна по кнопке "закрыть"', () => {
    cy.get('#edit-search-theme-form-1').click()

    cy.get('.digi-search-form__close').click()
    cy.get('.digi-search > .digi-wrapper').should('not.be.visible')
  })
})

describe('Избранное', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('Клик на избранное в шапке переводит на страницу избранного', () => {
    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.url().should('contain', 'favourite')
  })

  it('Нажатие на звездочку на товаре в карточке добавляет товар в раздел избранного', () => {
    cy.get('.swiper-slide-active > .shortcard > .shortcard__header > .shortcard__manage_btns > .shortcard__manage_btn').eq(0).click()
    cy.get('.noty_body').should('contain', 'Добавили в избранное')

    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.get('.shortcard.collect').should('exist')
  })

  it('Нажатие на звездочку на товаре в карточке добавляет товар в раздел избранного', () => {
    cy.visit('https://www.antica.su/product/keramogranit-baltico-grafito-60h60-144')
    cy.get('.card__manage_btn').click()
    cy.get('.noty_body').should('contain', 'Добавили в избранное')

    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.get('#favourite_goods_title').should('exist')
    cy.get('#favourite_goods').should('exist')
  })

  it('Добавление коллекции в избранное', () => {
    cy.visit('https://www.antica.su/collection/41zero42-futura')
    cy.get('.card__manage_btn').click()
    cy.get('.noty_body').should('contain', 'Добавили в избранное')

    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.get('#favourite_collects_title').should('exist')
    cy.get('#favourite_goods').should('exist')
  })

  it('Нажатие на звездочку на странице избранного удаляет товар из раздела', () => {
    cy.visit('https://www.antica.su/collection/41zero42-futura')
    cy.get('.card__manage_btn').click()
    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.get('.shortcard__manage_btns').click()
    cy.reload()
    cy.get('.shortcard').should('not.exist')
  })
})

describe('Корзина', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('Клик на корзину в шапке переводит на страницу корзины', () => {
    cy.get('[aria-label="Корзина"]').click({force: true})
    cy.url().should('contain', 'cart')
  })

  it('При изменении кол-ва товаров в корзине по кнопкам + и - меняется сумма - м2', () => {
    // cy.get('.factory_nav__alfabet').children().eq(getRandomInt(1, 26)).trigger('mouseover')
    // cy.get('.factory_nav__content').children().eq(getRandomInt(0, 28)).children().then((children) => {
    //   console.log(getRandomInt(0, children.length))
    //   cy.get(children).eq(getRandomInt(0, children.length)).children().click({force: true})
    // })
    //.click({force: true} )
    //cy.get('.shortcard').click()

    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="0"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('div.nbsp > b').invoke('text').as('price')

    cy.get('@price').then((price) => {
      cy.get('.plus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.plus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.minus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.minus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })
    })
})

  it('При изменении кол-ва товаров в корзине по кнопкам + и - меняется сумма - шт', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="1"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('div.nbsp > b').invoke('text').as('price')

    cy.get('@price').then((price) => {
      cy.get('.plus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.plus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.minus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.minus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })
    })
  })

  it('При изменении кол-ва товаров в корзине по кнопкам + и - меняется сумма - упак', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="4"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('div.nbsp > b').invoke('text').as('price')

    cy.get('@price').then((price) => {
      cy.get('.plus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.plus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.minus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })

      cy.get('.minus').click()
      cy.get('.cnt_block__input').invoke('val').as('inputVal')
        cy.get('@inputVal').then((val) => {
          cy.get('#cart-total-summ').should('contain', Math.round(price*val)) 
        })
    })
  })

  it('Удаление товара из корзины', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="4"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('.cart__itm').should('exist')
    cy.get('.delete-item').click()
    cy.get('.cart__itm').should('not.exist')
  })

  it('Отправка заказа', () => {
    const fakeValidPhone = faker.phone.number('791########')

    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="1"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('.cart__itm').should('exist')
    cy.get(':nth-child(1) > .form__field > .client_name').type('ТЕСТ ' + faker.name.firstName())

    cy.get(':nth-child(1) > :nth-child(2) > .form__field > .client_phone').type(fakeValidPhone, {force: true} )

    cy.get('.order__check > .btn').click()
    cy.get('.noty_body').should('contain', 'Заказ успешно создан')
    cy.get('.page-title').should('contain', 'Заказ оформлен! Номер вашего заказа:')
  })

  it('Нельзя оформить заказ с пустой корзиной', () => {
    cy.visit('https://www.antica.su/cart')
    cy.get('.cart__itm').should('not.exist')
    cy.get('.order__check > .btn').should('be.disabled')
  })

  it('Нельзя оформить заказ с некорректными данными в форме', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="4"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('.cart__itm').should('exist')
    cy.get(':nth-child(1) > .form__field > .client_name').type('ТЕСТ ' + faker.name.firstName())

    cy.get('.order__check > .btn').click()
    cy.get('.noty_body').should('contain', 'Введите пожалуйста номер телефона')
  })

  it('Нельзя оформить заказ, не подтвердив чекбокс с условиями соглашения', () => {
    const fakeValidPhone = faker.phone.number('792########')

    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="4"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('.cart__itm').should('exist')
    cy.get(':nth-child(1) > .form__field > .client_name').type('ТЕСТ ' + faker.name.firstName())
    cy.get(':nth-child(1) > :nth-child(2) > .form__field > .client_phone').type(fakeValidPhone)

    cy.get('.form__consent > i').click()
    cy.get('.order__check > .btn').should('be.disabled')
  })

  it.skip('Нельзя оформить заказ, если сумма корзины меньше минимальной допустимой (10 тыс)', () => {
    const fakeValidPhone = faker.phone.number('792########')

    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="4"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')

    cy.get('[aria-label="Корзина"]').click({force: true})

    cy.get('.cart__itm').should('exist')
    cy.get(':nth-child(1) > .form__field > .client_name').type('ТЕСТ ' + faker.name.firstName())
    cy.get(':nth-child(1) > :nth-child(2) > .form__field > .client_phone').type(fakeValidPhone)
    cy.get('.order__check > .btn').should('be.disabled')
  })
})

describe('Листинг', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('С карточки товара можно добавить товар в избранное и удалить оттуда', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('.shortcard__manage_btn').eq(0).click()
    cy.get('.noty_body').should('contain', 'Добавили в избранное')
    cy.reload()
    cy.get('.shortcard__manage_btn').eq(0).click()
    cy.get('.noty_body').should('contain', 'Убрали из избранного')
  })

  it.skip('На карточке товара можно изменять его кол-во', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    // cy.get('.shortcard-buy').eq(0).trigger('mouseenter')
    cy.get('.shortcard-buy').eq(0).invoke('show')
    cy.get('.cnt_block__form').eq(0).should('be.visible')
    cy.get('.cnt_block__btn.minus').eq(0).should('be.visible')
    cy.get('.cnt_block__btn.plus').eq(0).should('be.visible')
    cy.get('.cnt_block__input').eq(0).should('be.visible')

    cy.get('.cnt_block__btn.plus').eq(0).click({force: true})
    cy.get('.cnt_block__input').eq(0).should('have.text', 1)

    cy.get('.cnt_block__btn.plus').eq(0).click({force: true})
    cy.get('.cnt_block__input').eq(0).should('have.text', 2)
    

  })

  it.skip('Переключатель ед.измерения на карточке товара', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    // cy.get('.shortcard-buy').eq(0).realHover()
    cy.get('.shortcard').eq(4).invoke('show')
    cy.get('.cnt_block__form').eq(0).should('be.visible')

    cy.get('.cnt_block__select').eq(0).click({force: true})
    cy.get('.cnt_block__select > ul > [data-measure="1"]').eq(0).click({force: true})
    cy.get('.current').eq(0).children()
    .click({force: true})
    .should('have.text', 'шт.')
  })
  
  it.skip('С карточки товара можно добавить товар в корзину', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('.shortcard-buy').eq(0).realHover()
    // cy.get('.shortcard').eq(4).invoke('show')
    // cy.get('.cnt_block__form').eq(0).should('be.visible')
    // cy.get('.btn.btn-red.addtocart ').should('be.visible')
  })

  it.skip('Покупка в один клик (открытие окна)', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('.shortcard').eq(4).trigger('mouseover');
    cy.get('shortcard__buy_click.modal-open').should('be.visible')
  })

  it('Переключение сортировки', () => {
    cy.intercept('https://www.antica.su/sites/all/scripts/ajax_count.php').as('ajaxResponse')
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.wait('@ajaxResponse').then((interception) => {
      const sortType = interception.response.body.param.get.sorting
      expect(sortType).equals('popular')
    })

    cy.get(':nth-child(2) > i').click()
    cy.wait('@ajaxResponse').then((interception) => {
      const sortType = interception.response.body.param.get.sorting
      expect(sortType).equals('priceup')
    })

    cy.get(':nth-child(3) > i').click()
    cy.wait('@ajaxResponse').then((interception) => {
      const sortType = interception.response.body.param.get.sorting
      expect(sortType).equals('pricedown')
    })
  })

  it('Переключение вкладок Коллекции/Товары', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#collect_button').should('have.class', 'active')
    cy.get('#good_button').click()
    cy.get('#good_button').should('have.class', 'active')
    cy.get('#collect_button').click()
    cy.get('#collect_button').should('have.class', 'active')
  })

  it('Фильтрация по цене с помощью слайдеров', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()

    cy.get('.noUi-handle.noUi-handle-lower').eq(0).then(function($val){
      $val[0].setAttribute('aria-valuenow', '600')
    })
    cy.get('#price-range > div > div:nth-child(2) > div').should('have.attr', 'aria-valuenow', '600')

    cy.get('.noUi-handle.noUi-handle-upper').eq(0).then(function($val){
      $val[0].setAttribute('aria-valuenow', '12500')
    })
    cy.get('#price-range > div > div:nth-child(3) > div').should('have.attr', 'aria-valuenow', '12500')
  })

  it.skip('Фильтрация по цене с помощью ручного ввода цены', () => {
    cy.intercept('https://www.antica.su/sites/all/scripts/ajax_count.php').as('ajaxResponse')
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('#price-range_inputFrom').clear().type('1700')
    cy.get('#price-range_inputTo').clear().type('11300')
    cy.get('#price-range_inputFrom').should('have.value', '1700')
    cy.get('#price-range_inputTo').should('have.value', '11300')

    cy.wait('@ajaxResponse').then((interception) => {
      const minPrice = interception.response.body.param.get.min
      const maxPrice = interception.response.body.param.get.max

      expect(minPrice).equals('100')
      expect(maxPrice).equals('20000')
    })

    cy.wait('@ajaxResponse').then((interception) => {
      const minPrice = interception.response.body.param.get.min
      const maxPrice = interception.response.body.param.get.max

      expect(minPrice).equals('1700')
      expect(maxPrice).equals('11300')
    })
  })

  it('Фильтрация по ширине с помощью слайдеров', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()

    // cy.get('#shir-range > div > div:nth-child(2) > div').invoke('aria-valuenow', 7).trigger('change').click()
    // cy.get('#shir-range > div > div:nth-child(2) > div').invoke('attr', 'style', "position: absolute; z-index: 1; left: 150.025px; will-change: left;").trigger('change')
    // cy.get('#shir-range > div > div:nth-child(2) > div').invoke('attr', 'style', "position: absolute; z-index: 1; left: 56.025px; will-change: left;").click()
  
   cy.get('#shir-range > .noUi-base > [style="transform: translate(-100%, 0px); z-index: 5;"] > .noUi-handle').invoke('attr', 'style', "transform: translate(82.6087%, 0px); z-index: 5;").trigger('change')
   cy.get('#shir-range > .noUi-base > [style="transform: translate(-100%, 0px); z-index: 5;"] > .noUi-handle').invoke('attr', 'style', "transform: translate(8   2.6087%, 0px); z-index: 5;").click()
  })

  it.skip('Фильтрация по ширине с помощью ручного ввода', () => {
    cy.intercept('https://www.antica.su/sites/all/scripts/ajax_count.php').as('ajaxResponse')
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('#shir-range_inputFrom').clear().type('53')
    cy.get('#shir-range_inputTo').clear().type('118')
    cy.get('#shir-range_inputFrom').should('have.value', '53')
    cy.get('#shir-range_inputTo').should('have.value','118')

    cy.wait('@ajaxResponse').then((interception) => {
      const shir1 = interception.response.body.param.get.shir1
      const shir2 = interception.response.body.param.get.shir2

      expect(shir1).equals('1')
      expect(shir2).equals('300')
    })

    cy.wait('@ajaxResponse').then((interception) => {
      const shir1 = interception.response.body.param.get.shir1
      const shir2 = interception.response.body.param.get.shir2

      expect(shir1).equals('53')
      expect(shir2).equals('118')
    })
  })

  it('Фильтрация по длине с помощью слайдеров', () => {})

  it('Фильтрация по длине с помощью ручного ввода', () => {
    cy.intercept('https://www.antica.su/sites/all/scripts/ajax_count.php').as('ajaxResponse')
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('#dl-range_inputFrom').clear().type('12')
    cy.get('#dl-range_inputTo').clear().type('45').clickOutside()
    cy.get('#dl-range_inputFrom').should('have.value', '12')
    cy.get('#dl-range_inputTo').should('have.value','45')

    cy.wait('@ajaxResponse').then((interception) => {
      const dl1 = interception.response.body.param.get.dl1
      const dl2 = interception.response.body.param.get.dl2

      expect(dl1).equals('1')
      expect(dl2).equals('300')
    })

    cy.wait('@ajaxResponse').then((interception) => {
      const dl1 = interception.response.body.param.get.dl1
      const dl2 = interception.response.body.param.get.dl2

      expect(dl1).equals('12')
      expect(dl2).equals('300')
    })

    cy.wait('@ajaxResponse').then((interception) => {
      const dl1 = interception.response.body.param.get.dl1
      const dl2 = interception.response.body.param.get.dl2

      expect(dl1).equals('12')
      expect(dl2).equals('300')
    })

    cy.wait('@ajaxResponse').then((interception) => {
      const dl1 = interception.response.body.param.get.dl1
      const dl2 = interception.response.body.param.get.dl2

      expect(dl1).equals('12')
      expect(dl2).equals('45')
    })
  })

  it('Выбор и снятие чекбоксов в "разделе"', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('#arg_group > :nth-child(1) > .checkbox > i').click()
    cy.get('.tag_text').should('contain', 'настенная плитка')
    cy.get('.tag_text').should('contain', 'напольная плитка')
  })

  it('Очищение тегов под заголовком сбрасывает их и обновляет страницу', () => {
    cy.visit('https://www.antica.su/razdel/bezhevaya-napolnaya-keramicheskaya-plitka')
    cy.get('#good_button').click()
    cy.get('#arg_group > :nth-child(1) > .checkbox > i').click()
    cy.get('.tag_text').should('contain', 'настенная плитка')
    cy.get('.tag_text').should('contain', 'напольная плитка')
    cy.get('.tag_delete').click({ multiple: true })
    cy.get('.tag_text').should('not.contain', 'настенная плитка')
    cy.get('.tag_text').should('not.contain', 'напольная плитка')
  })
})

describe('Страница фабрики', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('Проверка вывода списка коллекций', () => {
    cy.visit('https://www.antica.su/factory/italon')
    cy.get('.catalog_short__list').children().should('have.length', 45)
  })
})

describe('Страница коллекции', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('Открытие формы "Заказать 3D раскладку"', () => {
    cy.visit('https://www.antica.su/collection/italon-continuum')
    cy.get('.card__help__itm').click()
    cy.get('#popup-3draskl').should('be.visible')
  })

  it('Успешное заполнение и отправка формы', () => {
    const fakeValidPhone = faker.phone.number('791########')

    cy.visit('https://www.antica.su/collection/italon-continuum')
    cy.get('.card__help__itm').click()
    cy.get('#\\33 draskl-form > :nth-child(2) > .client_name').type('ТЕСТ ' + faker.name.firstName())
    cy.get('#\\33 draskl-form > :nth-child(3) > .client_phone').type(fakeValidPhone)
    cy.get('#button-3draskl').click()
    cy.get('.noty_body').should('contain', 'Заявка успешно отправлена. Ожидайте пожалуйста звонка')
  })
})

describe('Страница карточки товара', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.viewport(1920, 1080)
    cy.visit('https://www.antica.su/')
  })

  it('Добавление и удаление товара из избранного', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__manage_btn').click()
    cy.get('.noty_body').should('contain', 'Добавили в избранное')

    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.get('.shortcard').should('exist')

    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__manage_btn').click()
    cy.get('.noty_body').should('contain', 'Убрали из избранного')
    cy.get('.header__shortmenu > :nth-child(1)').click()
    cy.get('.shortcard').should('not.exist')
  })

  it('Изменение кол-ва товара по кнопкам + и -', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__form > .plus').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__form > .cnt_block__input').invoke('val').as('quantity')

    cy.get('@quantity').then((price) => {
      cy.get('.card__price > .nbsp > b').invoke('text').as('inputVal')
        cy.get('@inputVal').then((val) => {

          var reg = new RegExp("[ ]+","g")
          val = val.replace(reg,"")

         cy.get('.card__order__result_sum > .val').should('contain', Math.round(price*Number(val))) 
        })
    })

    cy.get('.card__order__cnt > .cnt_block > .cnt_block__form > .minus').click()
    cy.get('@quantity').then((price) => {
      cy.get('.card__price > .nbsp > b').invoke('text').as('inputVal')
        cy.get('@inputVal').then((val) => {

          var reg = new RegExp("[ ]+","g")
          val = val.replace(reg,"")

         cy.get('.card__order__result_sum > .val').should('contain', Math.round(price*Number(val))) 
        })
    })
  })

  it('Изменение кол-ва товара ручным вводом', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="1"]').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__form > .cnt_block__input').clear().type(6).clickOutside()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__form > .cnt_block__input').invoke('val').as('quantity')

    cy.get('@quantity').then((price) => {
      cy.get('.card__price > .nbsp > b').invoke('text').as('inputVal')
        cy.get('@inputVal').then((val) => {
          var reg = new RegExp("[ ]+","g")
          val = val.replace(reg,"")

         cy.get('.card__order__result_sum > .val').should('contain', Math.floor(price*Number(Math.round(val.slice(0,2))))) 
        })
    })
  })

  it('Изменение единицы измерения', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="0"]').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').should('have.text', 'м²')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="1"]').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').should('have.text', 'шт.')

    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="4"]').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').should('have.text', 'упак.')
  })

  it('Добавление товара в корзину', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > .current').click()
    cy.get('.card__order__cnt > .cnt_block > .cnt_block__select > ul > [data-measure="0"]').click()
    cy.get('.card__order > .btn').click()
    cy.wait(300)
    cy.get('.card__order > .btn').click()
    cy.get('.noty_body').should('contain', 'Товар добавлен в корзину')
  })

  it('Покупка в один клик (открытие окна)', () => {
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.card__order__buy_click > span').click()
    cy.get('#popup-oneclick').should('be.visible')
    cy.get('#popup-oneclick > .modal-content > .modal-text > .section-title').should('contain', 'Быстрый заказ')
  })

  it('Успешная отправка формы "Заказать звонок"', () => {
    const fakeValidPhone = faker.phone.number('792########')
    cy.visit('https://www.antica.su/content/bas-botticino-60-beige-60x60')
    cy.get('.order-md-2 > .card__help__itm').click()
    cy.get('#popup-callback').should('be.visible')
    cy.get('#popup-callback > .modal-content > .modal-text > .section-title').should('contain', 'Заказать звонок')
    cy.get(':nth-child(1) > .client_name').type('ТЕСТ ' + faker.name.firstName())
    cy.get(':nth-child(2) > .client_phone').type(fakeValidPhone)
    cy.get('#button-call').click()
    cy.get('.noty_body').should('contain', 'Заявка успешно отправлена')
  })

  it('Успешная отправка формы "Видеодемонстрация"', () => {
    const fakeValidPhone = faker.phone.number('792########')
    cy.visit('https://www.antica.su/plitka/charme-advance-alabastro-white-nat-rect-40x80')
    cy.get('.card__help__itm-video').click()
    cy.get('#video-form > :nth-child(2) > .client_name').type('ТЕСТ ' + faker.name.firstName())
    cy.get('#video-form > :nth-child(3) > .client_phone').type(fakeValidPhone)
    cy.get('#button-video').click()
    cy.get('.noty_body').should('contain', 'Заявка успешно отправлена. Ожидайте пожалуйста звонка')
  })
})