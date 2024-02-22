import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import {buffer, catchError, from, mergeMap, Observable, of} from "rxjs";
import { EncryptionService } from './encryption.service';

var tempFilterUrl : string;
// PATH API
//let genericUrl = "http://localhost:8080/api/"
let apiCredentials = "http://localhost:8282/oauth2/token"

//GET PUBLIC KEY
let orgEncryption = "https://localhost:7017/api/GetPublicKey/"
let personEncryption = "https://localhost:7131/api/GetPublicKey/"
let authEncryption = "https://localhost:9000/api/rsa/GetPublicKey/"
let publicKeyUrl = "http://localhost:3000/api";

//get
//let getUtenteUrl = genericUrl + "utenti"
let getUtenteUrl = "http://localhost:9000/api/global/getAllUsers"
//let getPersonUrl = genericUrl + "people"
let getPersonUrl = "https://localhost:7131/api/People"
let getOrgUrl = "https://localhost:7017/api/Organizations"
//let getOrgUrl = genericUrl + "organization"

//add
//let addUtenteUrl = genericUrl + "addUtenti"
//let addPersonUrl = "https://localhost:7131/api/People/CreatePU?isFront=true"
let addPersonUrl = "https://localhost:7131/api/People/CreatePU"
//let addOrgUrl = genericUrl + "addOrganization"

/*details*/
let getUtenteByUsernameUrl = "http://localhost:9000/api/user"
//let getPersonByIdUrl = genericUrl + "person"
let getOrgByIdUrl = "https://localhost:7017/api/Organizations"

//update

//let updateUtenteUrl = genericUrl + "updateUtenti"
let updatePersonUrl = "https://localhost:7131/api/People"
let updatePersonRoleUrl = "http://localhost:9000/api/admin/changeRole"
let updateOrgUrl = "https://localhost:7017/api/Organizations"

//delete
//let deleteUtenteUrl = genericUrl + "deleteUtenti"
let deletePersonUrl = "https://localhost:7131/api/People"
let forcedDeletePersonUrl = "https://localhost:7131/api/People/ForceDelete"
let deleteOrgUrl = "https://localhost:7017/api/Organizations"

//login
let loginUrl = "http://localhost:9000/api/auth/login"
let getDecryptedMessage = "https://localhost:9000/api/rsa/decrypt"

//reset password
let resetPwdUrl = "http://localhost:9000/api/admin/changePassword"

//filer
//let personFilterUrl = "https://localhost:7131/api/People/GetPeopleByFiltering"

//forgot password
let forgotPwdByEmailUrl = "http://localhost:9000/api/forgot_password"

//Send email creation
let sendEmailCreateUrl = "http://localhost:9000/api/send_email_create"

// reset password by email
let resetPwdByEmailUrl = "http://localhost:9000/api/reset_password"

// get token by url
let getTokenUrl = "http://localhost:9000/api/reset_password"

let createUserUrl = "http://localhost:9000/api/auth/create"

let disableUserUrl = "http://localhost:9000/api/admin/disableUser"

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

        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCcById(username, disableUserUrl, null , accessToken);
      })
    );
  }

  public changeRole(username: string, roles: any ): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {

        // Chiamata successiva con l'access token
        return this.adminApiService.putWithCc(updatePersonRoleUrl, username, roles, accessToken);

      })
    );
  }

  public  getAllPeople(): Observable<any> {
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

  public getUtenteByUsername(username: string): Observable<any> {
    return this.adminApiService.getUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        return this.adminApiService.getByIDWithCc(getUtenteByUsernameUrl, username, accessToken)
      })
    );
  }

  //GET BY ID
  //public getPersonByID(id: number): Observable<any> {
  //  return this.adminApiServie.getById(getPersonByIdUrl, id)
  //}
  public getOrgByID(id: string): Observable<any> {
    return this.adminApiService.getById(getOrgByIdUrl, id)
  }

  //POST
  //public async addNewUser(model: any) : Promise<Observable<any>> {
  //  return await this.adminApiService.post(addUtenteUrl, this.encrypt(model))
  //}

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

  public forgotPwdByEmail(id: string, model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCcById(id,forgotPwdByEmailUrl, model, accessToken);
      })
    );
  }

  public sendEmailCreation(id: string, model: any): Observable<any> {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCcById(id,sendEmailCreateUrl, model, accessToken);
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
        return this.adminApiService.postWithCc(createUserUrl, JSON.stringify(model), accessToken);
      })
    );
  }

  //reset_password
  public resetPwd(username: string, password: any) {
    return this.adminApiService.postUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.putWithCc(resetPwdUrl,username, password, accessToken);
      })
    );
  }


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

    const eId = await this.encrypt(id, personEncryption)

    return this.adminApiService.putEncrypted(updatePersonUrl, Buffer.from(eId, 'utf-8').toString(), JSON.stringify(encryptedDto))
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

  //DELETE
  //public deleteUser(id: number) : Observable<any> {
  //  return this.adminApiServie.delete(deleteUtenteUrl, id)
  //}
  public deletePerson(id: string): Observable<any> {
    return this.adminApiService.deleteFisic(deletePersonUrl, id)
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
