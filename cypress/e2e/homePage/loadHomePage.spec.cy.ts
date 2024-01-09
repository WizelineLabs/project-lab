import homePageObject from "../pages/homePageObject"

describe('Verify Home Page Functionality', () =>{
    before('Navigate to the WizeLab home page' , () =>{
        cy.visit('/');
    })

    it('Verify that the home page properly loads' , () =>{

        const homePage = new homePageObject()
        homePage.verifyHomePageNavLoads()
        homePage.verifyHomePageFooterLoads()
        
   })   
})
