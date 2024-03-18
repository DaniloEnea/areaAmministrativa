# AreaAmministrativa


## Which branch use

The branch to use is: `encryption-service`

## How to start the program

If is the first time that you start the program, you must type on terminal: `npm install`.

After that, if you want to start the program, you must type: `ng serve`. 
You can use it on this link: http://localhost:4200.


## What you should start for use it

For use `Area Amministrativa` you should start:

- CRM-Clean:
  - PeopleManagerApi
  - OrganizationManagerApi
  - EmailTestApi

- oauth2 on branch `v2`

- auth on branch `encrypt&Decrypt` (only after that you have started `oauth2`)

You can have them on these URLs:
  - https://dev.azure.com/5EMMEInformatica/CRM-SaaS/_git/msOrg
  - https://github.com/jtabilas/oauth2/
  - https://github.com/jtabilas/auth/

  
You also must have to run this two commands on the terminal for the correct usage of the application:
  - cd [pathToTheFolder]\areaAmministrativa\src\assets
  - node public-key-api.js

If you see Encryption failed issue on login form,
see the documentation on this repository for install self-signed SSL certificate: https://github.com/jtabilas/auth/.

Also, if you use chrome, you should type this on your search bar: `chrome://flags/#allow-insecure-localhost`

and enable **Allow invalid certificates for resources load from localhost**

![Screenshot 2024-03-18 124907](https://github.com/DaniloEnea/areaAmministrativa/assets/96554342/6f307c27-95a2-4a91-8d9e-ef9fae71c608)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## For Test

For test our application you can use this credential:

  >Email: **danilo@gmail.com**

  >Password: **secret**

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

