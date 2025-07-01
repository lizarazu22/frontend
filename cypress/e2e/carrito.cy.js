describe('Carrito de compras', () => {
    let testEmail = '';
  
    before(() => {
      // Crear email único para esta corrida
      testEmail = `carrito${Date.now()}@correo.com`;
  
      // Crear usuario
      cy.visit('http://localhost:3000/signup');
      cy.get('[data-testid="signup-nombre"]').type('Tester Carrito');
      cy.get('[data-testid="signup-email"]').type(testEmail);
      cy.get('[data-testid="signup-password"]').type('123456');
      cy.get('[data-testid="signup-submit"]').click();
  
      // Confirmar que redirige a login antes de continuar
      cy.url().should('include', '/login');
  
      // Loguear usuario recién creado
      cy.get('[data-testid="login-email"]').type(testEmail);
      cy.get('[data-testid="login-password"]').type('123456');
      cy.get('[data-testid="login-submit"]').click();
  
      // Confirmar que ya no está en login
      cy.url().should('not.include', '/login');
    });
  
    it('debería añadir un producto al carrito', () => {
      // Visitar catálogo
      cy.visit('http://localhost:3000/catalog');
  
      // Esperar a que cargue al menos 1 producto
      cy.get('[data-testid^="product-card-"]').first().should('be.visible');
  
      // Obtener el id dinámico del primer producto
      cy.get('[data-testid^="product-card-"]').first().then($card => {
        const testId = $card.attr('data-testid'); // ej: product-card-654321
        const productId = testId.replace('product-card-', '');
  
        // Interceptar alert de éxito
        cy.on('window:alert', (txt) => {
          expect(txt).to.contain('agregado al carrito');
        });
  
        // Click en el botón Agregar al carrito de ese producto
        cy.get(`[data-testid="add-to-cart-${productId}"]`).click();
      });
    });
  });
  