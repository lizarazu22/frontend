describe('Protección de rutas privadas', () => {
    it('no debería permitir acceso a /mis-compras sin estar logueado', () => {
      // Limpiar localStorage
      cy.clearLocalStorage();
  
      // Ir a mis-compras sin token
      cy.visit('http://localhost:3000/mis-compras');
  
      // Verificar que redirige a login
      cy.url().should('include', '/login');
    });
  
    it('no debería permitir acceso a /admin/AdminDashboard sin estar logueado', () => {
      // Limpiar localStorage
      cy.clearLocalStorage();
  
      // Ir al dashboard admin sin token
      cy.visit('http://localhost:3000/admin/AdminDashboard');
  
      // Verificar que redirige a login
      cy.url().should('include', '/login');
    });
  });
  