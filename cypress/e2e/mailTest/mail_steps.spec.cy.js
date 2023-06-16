let data
let inboxId
let emailAddress
let emailBody
let otpCode
describe('testing email token extraction', () => {
  before(()=>{
    cy.fixture('selectors').then((sel)=>{
      data = sel
      cy.visit('/')
    })
  })
  it('click the create account button', ()=>{
    cy.get(data.createAccountButton).should('exist').click()
  })
  it('fill in the full name', () => {
    cy.get(data.fullnameField).should('exist').type('John Gomez')
  })
  it('fill in the business name', ()=>{
    cy.get(data.biznameField).should('exist').type('automation5005')
  })
  it('fill in the business email', () => {
    cy.mailslurp()
    .then(mailslurp => mailslurp.createInbox())
    .then(inbox =>{
      inboxId = inbox.id
      emailAddress = inbox.emailAddress
      cy.get(data.bizemailField).should('exist').type(emailAddress)
    })
  })
  it('fill in the phone number', () => {
    cy.get(data.phoneField).should('exist').type('+2348111115005')
  })
  it('fill in the registeration number', ()=>{
    cy.get(data.bizregField).should('exist').type('@automation5005')
  })
  it('click to continue signUp', ()=>{
    cy.get(data.nextButton).should('exist').click()
  })
  it('choose a source of info about mima', ()=>{
    cy.get(data.sourceTag).should('exist').click()
    cy.get(data.chooseIG).should('exist').click()
  })
  it('fill in the password', ()=>{
    cy.get(data.passwordField).should('exist').type('Password1@')
  })
  it('click to complete signUp', ()=>{
    cy.get(data.signUpButton).should('exist').click()
  })
  it('insert the OTP', ()=>{
    cy.mailslurp()
    .then(mailslurp => mailslurp.waitForLatestEmail(inboxId, 30000, true))
    .then(email =>{
      emailBody = email.body
      const parser = new DOMParser()
      const doc = parser.parseFromString(emailBody, 'text/html')
      var otp = doc.querySelector('tr:nth-of-type(2) > td > table td > p:nth-of-type(3)').textContent
      otpCode = otp.trim()
      cy.get(data.otpField).each(($el, index)=>{
        cy.wrap($el).should('exist').type(otpCode[index])
      })
    })
  })
})