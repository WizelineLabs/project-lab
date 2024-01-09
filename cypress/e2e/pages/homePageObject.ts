class homePageObject{
    
    elements ={

        // nav bar elements
        btnContactNav : () =>  cy.get('[href="https://www.wizeline.com/contact/"] > .css-1vg1w8o'),
        btnAboutNav : () =>  cy.get('[href=" https://www.wizeline.com/about-us/"] > .css-1vg1w8o'),
        btnWorkNav : () => cy.get('[href="https://www.wizeline.com/offerings/"] > .css-1vg1w8o'),
        btnAcademyNav : () => cy.get('[href="https://academy.wizeline.com/"] > .css-1vg1w8o'),
        btnWizeLoginNav : () => cy.get('.css-4zvxj1 > [href="/login/wizeline"]'),
        btnApplicantLoginNav : () => cy.get('.css-4zvxj1 > [href="/login/linkedin"]'),
        
        //footer elements
        btnWizeLoginFooter : () => cy.get('.css-1goxvja > [href="/login/wizeline"]'),
        btnApplicantLoginFooter : () => cy.get('.css-1goxvja > [href="/login/linkedin"]'),
        btnViewProjectFooter : () => cy.get('.MuiButton-contained'),
        

    }
    verifyHomePageNavLoads(){

        // Verify nav bar elements are visible
        this.elements.btnContactNav().should('be.visible')
        this.elements.btnAboutNav().should('be.visible')
        this.elements.btnWorkNav().should('be.visible')
        this.elements.btnAcademyNav().should('be.visible')
        this.elements.btnWizeLoginNav().should('be.visible')
        this.elements.btnApplicantLoginNav().should('be.visible')
        
        // Verify Footer elements are visible
    }
    verifyHomePageFooterLoads(){
        this.elements.btnWizeLoginFooter().scrollIntoView().should('be.visible')
        this.elements.btnApplicantLoginFooter().scrollIntoView().should('be.visible')
        this.elements.btnViewProjectFooter().scrollIntoView().should('be.visible')   
    }

}

export default homePageObject;