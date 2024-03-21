import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import { catchError, combineLatest, from, map, mergeMap, Observable, of} from "rxjs";
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



  constructor(private adminApiService: AdminApiService) { }

  /* ALL METHOD API FOR USER'S */

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

        return this.adminApiService.postWithCcById(username, disableUserUrl, null, accessToken)

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

        return this.adminApiService.postWithCcById(username, abilityUserUrl, null, accessToken)

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

          return this.adminApiService.putWithCc(updatePersonRoleUrl, username, roles, accessToken)

      })
    );
  }

  public getAllPeople(): Observable<any> {

    const Url = `${getPersonUrl}?allEntities=true`;

    return this.adminApiService.get(Url)
  }

  public getAllOrg(): Observable<any>{

    const Url = `${getOrgUrl}?allEntities=true`;

    return this.adminApiService.get(Url)
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

        return this.adminApiService.getByIDWithCc(getUserExistsUrl, username, accessToken);

      })
    );
  }


  //GET BY ID

  public getOrgByID(id: string): Observable<any> {

    const Url = `${getOrgByIdUrl}/${encodeURIComponent(id)}?allEntities=true`;
    return from(this.adminApiService.get(Url)).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  //POST

  public addNewPU(model: any): Observable<any> {

    return this.adminApiService.post(addPersonUserUrl, JSON.stringify(model))
  }

  public addNewPerson(model: any): Observable<any> {
    
    return this.adminApiService.post(addPersonUrl, JSON.stringify(model))
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

        return this.adminApiService.postWithCcById(email, forgotPwdByEmailUrl, null, accessToken);

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

    return this.adminApiService.postWithCcById(email, sendEmailCreateUrl, null, accessToken);

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

  public login(model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        return this.adminApiService.postWithCc(loginUrl, model, accessToken);
      })
    );
  }

  public createUser(model: any): Observable<any> {
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
  public updatePerson(id: string, model: any): Observable<any> {

    return this.adminApiService.put(updatePersonUrl, id, JSON.stringify(model))
  }


  public updateOrg(id: string, model: any): Observable<any> {

    return this.adminApiService.put(updateOrgUrl, id, JSON.stringify(model))
  }


  public patchGDPRPerson(id: string): Observable<any> {

    return this.adminApiService.patch(patchPersonUrl, id, "IsGDPRTermsAccepted", true)
  }


  public patchHasUserPerson(id: string): Observable<any> {

    return this.adminApiService.patch(patchPersonUrl, id, "HasUser", true)
  }
  //DELETE

  public deletePerson(id: string): Observable<any> {

    return this.adminApiService.deleteEncrypted(deletePersonUrl, id)
  }

  public forcedDeletePerson(id: string): Observable<any> {
    return this.adminApiService.deleteFisic(forcedDeletePersonUrl, id)
  }

}
