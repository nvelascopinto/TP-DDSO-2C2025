describe('paginado', () => {
  it('realiza cambio de pagina', () => {
    cy.visit('http://localhost:3002/tienda/vendedorTest')

    cy.get('.product-card__button').first().click();
    cy.visit('http://localhost:3002/carrito')
    cy.get('.quantity-control__button').contains('+')
    .click()
    .click()
    .click();

    cy.get('.cart-item__max-stock')
    .should('be.visible')
    .and('contain', 'Has alcanzado el límite de unidades disponibles.');
  })
})