import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import { catchError, combineLatest, from, map, mergeMap, Observable, of} from "rxjs";
import { EncryptionService } from './encryption.service';
import config from '../conf_url.json'

// PATH API
let apiCredentials = config.auth.apiCredentials

//GET PUBLIC KEY
let orgEncryption = config.orgEncryption
let personEncryption = config.personEncryption
let authEncryption = config.auth.authEncryption
let publicKeyUrl = config.publicKeyUrl

//get
let getUtenteUrl = config.auth.getUtenteUrl
let getPersonUrl = config.getPersonUrl
let getPersonByEmailUrl = config.getPersonByEmailUrl
let getOrgUrl = config.getOrgUrl

//add
let addPersonUrl = config.addPersonUrl
let addPersonUserUrl = config.addPersonUserUrl

/*details*/
let getUtenteByUsernameUrl = config.auth.getUtenteByUsernameUrl
let getUserExistsUrl = config.auth.getUserExistsUrl
let getOrgByIdUrl = config.getOrgByIdUrl

//update
let updatePersonUrl = config.updatePersonUrl
let updatePersonRoleUrl = config.auth.updatePersonRoleUrl
let updateOrgUrl = config.updateOrgUrl

//patch
let patchPersonUrl = config.patchPersonUrl

//delete
let deletePersonUrl = config.deletePersonUrl
let forcedDeletePersonUrl = config.forcedDeletePersonUrl
let deleteOrgUrl = config.deleteOrgUrl

//login
let loginUrl = config.auth.loginUrl
let getDecryptedMessage = config.auth.getDecryptedMessage

//reset password
let resetPwdUrl = config.auth.resetPwdUrl

//forgot password
let forgotPwdByEmailUrl = config.auth.forgotPwdByEmailUrl

//Send email creation
let sendEmailCreateUrl = config.auth.sendEmailCreateUrl

// reset password by email
let resetPwdByEmailUrl = config.auth.resetPwdByEmailUrl

// get token by url
let getTokenUrl = config.auth.getTokenUrl

let createUserUrl = config.auth.createUserUrl

let disableUserUrl = config.auth.disableUserUrl

let abilityUserUrl = config.auth.abilityUserUrl

export interface BodyComboDto {
  Data1: any;
  Data2: string;
}

export interface EncryptedAuthData {
  encryptedUsername: string;
  encryptedBody: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {



  constructor(private adminApiService: AdminApiService, private encryptionService: EncryptionService) { }

  /* ALL METHOD API FOR USER'S */

  public async encrypt(obj: string, backUrl: string): Promise<string> {
    // Convert the form data to a JSON string and then encrypt it
    return await this.encryptionService.encryptRSASplit(obj, backUrl);
  }

  public decrypt(encryptedObj: string): any {
    // Decrypt the encrypted form data
    const decryptedString = this.encryptionService.decryptRSASplit(encryptedObj);

    if (decryptedString) {
      try {
        // Parse the decrypted JSON string
        const decryptedFormValue = JSON.parse(decryptedString);
        return decryptedFormValue;
      } catch (error) {
        console.error('Error parsing decrypted JSON:', error);
        return null;
      }
    } else {
      // Handle decryption failure
      console.error('Error decrypting form data');
      return null;
    }
  }

  private decryptToken(accessToken: string): any {
    return this.adminApiService.getWithCc(getDecryptedMessage, accessToken)
  }

  //GET
  public getAllUsers(): Observable<any> {
    return this.adminApiService.getUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.getWithCc(getUtenteUrl, accessToken);
      })
    );
  }

  public disableUser(username: string): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;
        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        return from(this.encrypt(username, authEncryption)).pipe(
          map(usernameEncrypt => btoa(usernameEncrypt)),
          mergeMap(usernameEncryptBase64 =>
            this.adminApiService.postWithCcById(usernameEncryptBase64, disableUserUrl, null, accessToken)
          )
        );
      })
    );
  }

  public abilityUser(username: string): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        return from(this.encrypt(username, authEncryption)).pipe(
          map(usernameEncrypt => btoa(usernameEncrypt)),
          mergeMap(usernameEncryptBase64 =>
            this.adminApiService.postWithCcById(usernameEncryptBase64, abilityUserUrl, null, accessToken)
          )
        );
      })
    );
  }

  public changeRole(username: string, roles: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;
        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Convertire la Promise restituita da encrypt in un Observable
        const encryptedUsername$ = from(this.encrypt(username, authEncryption));
        const encryptedRoles$ = from(this.encrypt(JSON.stringify(roles), authEncryption));

        // Utilizzare combineLatest per attendere che entrambe le encryption siano completate
        return combineLatest([encryptedUsername$, encryptedRoles$]).pipe(
          map(([eUsername, eRoles]) => {
            return { eUsername, eRoles };
          }),
          mergeMap(({ eUsername, eRoles }) =>
            this.adminApiService.putWithCc(updatePersonRoleUrl, btoa(eUsername), eRoles, accessToken)
          )
        );
      })
    );
  }

  public getAllPeople(): Observable<any> {
    //publicKeyUrl = encodeURIComponent(publicKeyUrl);
    const Url = `${getPersonUrl}?publicKeyUrl=${encodeURIComponent(publicKeyUrl)}&allEntities=true`;

    return from(this.adminApiService.get(Url)).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  public getAllOrg(): Observable<any>{
    //publicKeyUrl = encodeURIComponent(publicKeyUrl);
    //const Url = `${getOrgUrl}?publicKeyUrl=${encodedPublicKey}&allEntities=true`;
    const Url = `${getOrgUrl}?publicKeyUrl=${encodeURIComponent(publicKeyUrl)}&allEntities=true`;

    return from(this.adminApiService.get(Url)).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  //public async getPersonByEmail(email: string): Promise<Observable<any>> {
  //  //publicKeyUrl = encodeURIComponent(publicKeyUrl);
  //  var encEmail = await this.encrypt(email, personEncryption);

  //  return from(this.adminApiService.getByEmail(getPersonByEmailUrl, encodeURI(encEmail))).pipe(
  //    catchError(error => {
  //      throw error;
  //    })
  //  );
  //}

  public getUtenteByUsername(username: string): Observable<any> {
    return this.adminApiService.getUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap(async (accessToken: string) => {
        return this.adminApiService.getByIDWithCc(getUtenteByUsernameUrl, username, accessToken)
      })
    );
  }

  public getUserExists(username: string) {
    return this.adminApiService.getUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;
        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        return from(this.encrypt(username, config.auth.authEncryption)).pipe(
          mergeMap((username: string) => {
            const decodedUsername = btoa(username)
            return this.adminApiService.getByIDWithCc(getUserExistsUrl, decodedUsername, accessToken);
          })
        );
      })
    );
  }


  //GET BY ID
  //public getPersonByID(id: number): Observable<any> {
  //  return this.adminApiServie.getById(getPersonByIdUrl, id)
  //}
  public async getOrgByID(id: string): Promise<Observable<any>> {

    id = btoa(await this.encrypt(id, orgEncryption));
    const Url = `${getOrgByIdUrl}/${encodeURIComponent(id)}?publicKeyUrl=${encodeURIComponent(publicKeyUrl)}&allEntities=true`;
    return from(this.adminApiService.get(Url)).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  //POST
  //public async addNewUser(model: any) : Promise<Observable<any>> {
  //  return await this.adminApiService.post(addUtenteUrl, this.encrypt(model))
  //}

  public async addNewPU(model: any): Promise<Observable<any>> {

    const bcDto: BodyComboDto = {
      Data1: model,
      Data2: publicKeyUrl
    }

    const encryptedDto = await this.encrypt(JSON.stringify(bcDto), personEncryption);

    return await this.adminApiService.postEncrypted(addPersonUserUrl, JSON.stringify(encryptedDto))
  }

  public async addNewPerson(model: any): Promise<Observable<any>> {

    const bcDto: BodyComboDto = {
      Data1: model,
      Data2: publicKeyUrl
    }

    const encryptedDto = await this.encrypt(JSON.stringify(bcDto), personEncryption);

    return await this.adminApiService.postEncrypted(addPersonUrl, JSON.stringify(encryptedDto))
  }

  //public addNewOrg(model: any): Observable<any> {
  //  return this.adminApiService.post(addOrgUrl, this.encrypt(model,orgEncryption))
  //}

  public forgotPwdByEmail(email: string): Observable<any> {
  return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
    mergeMap((value: any) => {
      const accessToken = value.body.access_token;
      return of(accessToken);
    }),
    mergeMap((accessToken: string) => {
      return from(this.encrypt(email, config.auth.authEncryption)).pipe(
        mergeMap((emailEncrypt: string) => {
          const decodedEmail = btoa(emailEncrypt)
          return this.adminApiService.postWithCcById(decodedEmail, forgotPwdByEmailUrl, null, accessToken);
        })
      );
    })
  );
  }

public sendEmailCreation(email: string): Observable<any> {
  return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
    mergeMap((value: any) => {
      const accessToken = value.body.access_token;
      return of(accessToken);
    }),
    mergeMap((accessToken: string) => {
      return from(this.encrypt(email, config.auth.authEncryption)).pipe(
        mergeMap((emailEncrypt: string) => {
          const decodedEmail = btoa(emailEncrypt)
          return this.adminApiService.postWithCcById(decodedEmail, sendEmailCreateUrl, null, accessToken);
        })
      );
    })
  );
}

  public resetPwdByEmail(model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.putCc(resetPwdByEmailUrl,model,accessToken);
      })
    );
  }

  public getTokenUrl(queryParams: any): Observable<any> {
    return this.adminApiService.getUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.getCc(getTokenUrl, accessToken, queryParams);
      })
    );
  }

  //LOGIN
  /*
  public login(model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCc(loginUrl, model, accessToken);
      })
    );
  }
  */

  public loginEncrypted(model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCc(loginUrl, model, accessToken);
      })
    );
  }

  public createUserEncrypted(model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCc(createUserUrl, model, accessToken);
      })
    );
  }

  //reset_password
  //public resetPwd(username: string) {
  //  return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
  //    mergeMap((value: any) => {
  //      const accessToken = value.body.access_token;

  //      return of(accessToken);
  //    }),
  //    mergeMap(async (accessToken: string) => {
  //      const usernameEncrypt = await this.encrypt(JSON.stringify(username), authEncryption);
  //      const bodyEncrypt: BodyDtoEncrypt = { encryptedEmail: usernameEncrypt, encryptedContent: "" }
  //      return this.adminApiService.putWithCc(resetPwdUrl,bodyEncrypt, accessToken);
  //    })
  //  );
  //}


  //PUT
  //public updateUser(id: number, model : any) : Observable<any> {
  // return this.adminApiServie.put(updateUtenteUrl,id, model)
  //}
  public async updatePerson(id: string, model: any): Promise<Observable<any>> {

    const bcDto: BodyComboDto = {
      Data1: model,
      Data2: publicKeyUrl
    }

    const encryptedDto = await this.encrypt(JSON.stringify(bcDto), personEncryption);

    const eId = btoa(await this.encrypt(id, personEncryption));

    return this.adminApiService.put(updatePersonUrl, eId, JSON.stringify(encryptedDto))
  }


  public async updateOrg(id: string, model: any): Promise<Observable<any>> {
    const bcDto: BodyComboDto = {
      Data1: model,
      Data2: publicKeyUrl
    }

    const encryptedDto = await this.encrypt(JSON.stringify(bcDto), orgEncryption);

    const eId = btoa(await this.encrypt(id, orgEncryption));

    return this.adminApiService.put(updateOrgUrl, eId, JSON.stringify(encryptedDto))
  }


  public async patchGDPRPerson(id: string): Promise<Observable<any>> {

    id = btoa(await this.encrypt(id, personEncryption));

    return this.adminApiService.patch(patchPersonUrl, id, "IsGDPRTermsAccepted", true, publicKeyUrl)
  }


  public async patchHasUserPerson(id: string): Promise<Observable<any>> {

    id = btoa(await this.encrypt(id, personEncryption));

    return this.adminApiService.patch(patchPersonUrl, id, "HasUser", true, publicKeyUrl)
  }
  //DELETE
  //public deleteUser(id: number) : Observable<any> {
  //  return this.adminApiServie.delete(deleteUtenteUrl, id)
  //}
  public async deletePerson(id: string): Promise<Observable<any>> {
    const eId = btoa(await this.encrypt(id, personEncryption));
    return this.adminApiService.deleteEncrypted(deletePersonUrl, eId, publicKeyUrl)
  }

  public forcedDeletePerson(id: string): Observable<any> {
    return this.adminApiService.deleteFisic(forcedDeletePersonUrl, id)
  }
  //public deleteOrg(id: string): Observable<any> {
  //  return this.adminApiService.delete(deleteOrgUrl, id)
  //}

  //Filter
  /*public filterPeople(endUrl: string) {
    return this.adminApiServie.getFiltered(personFilterUrl, endUrl)
  }*/

  /*public filterPeople(first_name:string, last_name:string) {

      if(!(first_name==null)) {
        tempFilterUrl = "name=" + first_name
        if(!(last_name==null)){
          tempFilterUrl = tempFilterUrl + "&"
        }
      }
      if(!(last_name==null)) {
        tempFilterUrl = tempFilterUrl +"last_name=" + last_name
      }
    return this.adminApiServie.getFiltered(personFilterUrl, tempFilterUrl)
  }*/

}
