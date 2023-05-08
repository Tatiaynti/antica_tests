import { faker } from '@faker-js/faker'
Cypress.config('pageLoadTimeout', 100000)

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

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

    cy.get('.client_name').eq(0).type(faker.name.firstName())
    cy.get('.client_phone').eq(0).type(fakeValidPhone)
    cy.get('#button-call').click()

    cy.get('.noty_body').should('contain', 'Заявка успешно отправлена')
  })

  it('Успешная отправка формы с заполненными полями из футера', () => {
    const fakeValidPhone = faker.phone.number('792########')

    cy.get('.btn.btn-blue.modal-open').click()

    cy.get('.client_name').eq(0).clear()
    cy.get('.client_name').eq(0).type(faker.name.firstName())
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