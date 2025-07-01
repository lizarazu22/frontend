describe('Visualización de carrito', () => {
    let testEmail = '';
    let user = null;
    let token = '';
  
    before(() => {
      testEmail = `carrito${Date.now()}@correo.com`;
  
      cy.visit('http://localhost:3000/signup');
      cy.get('[data-testid="signup-nombre"]').type('Tester Carrito');
      cy.get('[data-testid="signup-email"]').type(testEmail);
      cy.get('[data-testid="signup-password"]').type('123456');
      cy.get('[data-testid="signup-submit"]').click();
      cy.url().should('include', '/login');
  
      cy.request('POST', 'http://localhost:5000/api/auth/login', {
        email: testEmail,
        password: '123456'
      }).then((res) => {
        expect(res.status).to.eq(200);
        token = res.body.token;
        user = res.body.user;
      });
    });
  
    it('debería agregar un producto al carrito y visualizarlo', () => {
      cy.visit('http://localhost:3000');
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify(user));
        win.localStorage.setItem('token', token);
      });
      cy.reload();
  
      const ensureMenuOpen = () => {
        cy.get('[data-testid="menu-button"]').then(($btn) => {
          if (!$btn.hasClass('open')) {
            cy.wrap($btn).click();
          }
        });
      };
  
      const ensureMenuClosed = () => {
        cy.get('[data-testid="menu-button"]').then(($btn) => {
          if ($btn.hasClass('open')) {
            cy.wrap($btn).click();
          }
        });
      };
  
      // Navegar a catálogo
      ensureMenuOpen();
      cy.get('[data-testid="link-catalogo"]').click();
  
      cy.get('[data-testid="product-grid"]', { timeout: 8000 }).should('be.visible');
  
      cy.get('[data-testid^="product-card-"]', { timeout: 8000 })
        .first()
        .should('be.visible')
        .scrollIntoView()
        .within(() => {
          cy.get('input[type="number"]').should('be.visible').clear().type('1');
          cy.contains('Agregar al carrito').should('be.visible').click();
        });
  
      cy.intercept('GET', 'http://localhost:5000/api/carrito').as('getCart');
  
      // ⚠️ Forzar abrir menú después del alert (que a veces provoca repaint)
      cy.wait(500); // darle un respiro al alert para cerrar y DOM repintar
      ensureMenuOpen();
  
      // 📌 Finalmente acceder al carrito con { force: true } si necesario
      cy.get('[data-testid="link-carrito"]', { timeout: 4000 })
        .should('exist')
        .click({ force: true });
  
      cy.wait('@getCart');
  
      cy.get('[data-testid="cart-item"]').should('have.length.at.least', 1);
    });
  });
  