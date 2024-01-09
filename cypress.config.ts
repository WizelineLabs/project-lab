import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {

      require('dotenv').config()
      const environment = config.env.url
      let url = ''

      if(environment === 'dev'){
        url = `${process.env.DEV_URL}`
      }else if(environment === 'prod'){
        url = `${process.env.PROD_URL}`
      }else{
        url = `${process.env.BASE_URL}`
      }

      // const isDev = config.watchForFileChanges;
      // const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: url,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      };

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      on("task", {
        log: (message) => {
          console.log(message);

          return null;
        },
      });

      return { ...config, ...configOverrides };
    },
  },
});

// import { defineConfig } from "cypress";

// export default defineConfig({
//   e2e: {
//     setupNodeEvents: (on, config) => {
      
//       require('dotenv').config()
//       const environment = config.env.url

//       if(environment === 'dev'){
//         config.baseUrl = `${process.env.DEV_URL}`
//       }else if(environment === 'prod'){
//         config.baseUrl = `${process.env.PROD_URL}`
//       }else{
//         config.baseUrl = `${process.env.BASE_URL}`
//       }

//       return config
//     },
//     viewportWidth: 1500,
//     viewportHeight: 660,
//   },
// });
 