describe('Autenticación de usuario', () => {
    let testEmail = ''; // 👉 variable para todo el describe
  
    it('debería registrar un nuevo usuario correctamente', () => {
      cy.visit('http://localhost:3000/signup');
  
      testEmail = `test${Date.now()}@correo.com`;
  
      cy.get('[data-testid="signup-nombre"]').type('Usuario Test');
      cy.get('[data-testid="signup-email"]').type(testEmail);
      cy.get('[data-testid="signup-password"]').type('123456');
      cy.get('[data-testid="signup-submit"]').click();
  
      cy.url().should('include', '/login');
    });
  
    it('debería iniciar sesión correctamente con usuario recién creado', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('[data-testid="login-email"]').type(testEmail);
      cy.get('[data-testid="login-password"]').type('123456');
      cy.get('[data-testid="login-submit"]').click();
  
      cy.url().should('not.include', '/login');
    });
  
    it('debería cerrar sesión correctamente', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('[data-testid="login-email"]').type(testEmail);
      cy.get('[data-testid="login-password"]').type('123456');
      cy.get('[data-testid="login-submit"]').click();
  
      cy.get('[data-testid="logout-button"]').click();
  
      cy.url().should('include', '/login');
    });
  
    it('no debería permitir registro con password menor a 6 caracteres', () => {
      cy.visit('http://localhost:3000/signup');
  
      const invalidEmail = `fail${Date.now()}@correo.com`;
  
      cy.get('[data-testid="signup-nombre"]').type('Usuario Test');
      cy.get('[data-testid="signup-email"]').type(invalidEmail);
      cy.get('[data-testid="signup-password"]').type('123');
      cy.get('[data-testid="signup-submit"]').click();
  
      cy.contains('La contraseña debe tener al menos 6 caracteres.').should('be.visible');
    });
  
    it('no debería permitir login con credenciales inválidas', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('[data-testid="login-email"]').type('noexiste@correo.com');
      cy.get('[data-testid="login-password"]').type('123456');
      cy.get('[data-testid="login-submit"]').click();
  
      cy.contains('Credenciales incorrectas.').should('be.visible');
    });
  
    it('debería enviar correo de recuperación de contraseña correctamente', () => {
      const recoveryEmail = `recover${Date.now()}@correo.com`;
  
      cy.visit('http://localhost:3000/login');
  
      // Escribir email en el input
      cy.get('[data-testid="login-email"]').type(recoveryEmail);
  
      // Click en link de "¿Olvidaste tu contraseña?"
      cy.get('[data-testid="forgot-password-link"]').click();
  
      // Validar que navegó y muestra el email correcto
      cy.url().should('include', '/forgot-password');
      cy.contains(recoveryEmail).should('be.visible');
  
      // Simular petición exitosa
      cy.intercept('POST', 'http://localhost:5000/api/reset-password/forgot-password', {
        statusCode: 200,
        body: { message: 'Correo enviado correctamente.' }
      }).as('sendRecoveryEmail');
  
      // Capturar alert
      let alertMessage = '';
      cy.on('window:alert', (txt) => {
        alertMessage = txt;
      });
  
      // Click en botón de enviar
      cy.get('[data-testid="send-recovery-email"]').click();
  
      // Esperar la petición simulada
      cy.wait('@sendRecoveryEmail');
  
      // Validar que la alerta contiene el texto esperado
      cy.wrap(null).should(() => {
        expect(alertMessage).to.contain(`Se ha enviado un correo de recuperación a ${recoveryEmail}`);
      });
  
      // Validar redirección a login
      cy.url().should('include', '/login');
    });
  });
  