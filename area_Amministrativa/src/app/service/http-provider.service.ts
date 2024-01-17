import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import {mergeMap, Observable, of} from "rxjs";

var tempFilterUrl : string;
// PATH API
let genericUrl = "http://localhost:8080/api/"
let apiCredentials = "http://localhost:8282/oauth2/token"

//get
//let getUtenteUrl = genericUrl + "utenti"
let getUtenteUrl = "http://localhost:9000/api/global/getAllUsers"
//let getPersonUrl = genericUrl + "people"
let getPersonUrl = "https://localhost:7131/api/People"
let getOrgUrl = "https://localhost:7017/api/Organizations"
//let getOrgUrl = genericUrl + "organization"

//add
let addUtenteUrl = genericUrl + "addUtenti"
let addPersonUrl = "https://localhost:7131/api/People/CreatePU"
let addOrgUrl = genericUrl + "addOrganization"

/*details*/
//let getUtenteByIdUrl = genericUrl + "utenti"
//let getPersonByIdUrl = genericUrl + "person"
let getOrgByIdUrl = "https://localhost:7017/api/Organizations"

//update

let updateUtenteUrl = genericUrl + "updateUtenti"
let updatePersonUrl = "https://localhost:7131/api/People"
let updatePersonRoleUrl = "http://localhost:9000/api/admin/changeRole"
let updateOrgUrl = "https://localhost:7017/api/Organizations"

//delete
let deleteUtenteUrl = genericUrl + "deleteUtenti"
let deletePersonUrl = "https://localhost:7131/api/People"
let deleteOrgUrl = "https://localhost:7017/api/Organizations"

//login
let loginUrl = "http://localhost:9000/api/auth/login"

//reset password
let resetPwdUrl = "http://localhost:9000/api/admin/changePassword"

//filer
let personFilterUrl = "https://localhost:7131/api/People/GetPeopleByFiltering"

// reset password by email
let resetPwdByEmailUrl = "http://localhost:9000/api/forgot_password"

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private adminApiService: AdminApiService) { }

  /* ALL METHOD API FOR USER'S */

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

  public getAllPeople(): Observable<any> {
    return this.adminApiService.get(getPersonUrl)
  }
  public getAllOrg(): Observable<any> {
    return this.adminApiService.get(getOrgUrl)
  }

  //GET BY ID
  //public getUtenteByID( id: number): Observable<any> {
  //  return this.adminApiServie.getById(getUtenteByIdUrl, id)
  //}
  //public getPersonByID(id: number): Observable<any> {
  //  return this.adminApiServie.getById(getPersonByIdUrl, id)
  //}
  public getOrgByID(id: number): Observable<any> {
    return this.adminApiService.getById(getOrgByIdUrl, id)
  }

  //POST
  public addNewUser(model: any) : Observable<any> {
    return this.adminApiService.post(addUtenteUrl, model)
  }
  public addNewPerson(model: any): Observable<any> {
    return this.adminApiService.post(addPersonUrl, model)
  }
  public addNewOrg(model: any): Observable<any> {
    return this.adminApiService.post(addOrgUrl, model)
  }

  public resetPwdByEmail(id: string, model: any): Observable<any> {
    return this.adminApiService.putUrlEncoded(apiCredentials).pipe(
      mergeMap((value: any) => {
        const accessToken = value.body.access_token;

        return of(accessToken);
      }),
      mergeMap((accessToken: string) => {
        // Chiamata successiva con l'access token
        return this.adminApiService.postWithCcById(id,resetPwdByEmailUrl, model, accessToken);
      })
    );
  }

  //LOGIN
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
  public updatePerson(id: string, model: any): Observable<any> {
    return this.adminApiService.put(updatePersonUrl,id, model)
  }
  public updateOrg(id: string, model: any): Observable<any> {
    return this.adminApiService.put(updateOrgUrl, id, model)
  }

  //DELETE
  //public deleteUser(id: number) : Observable<any> {
  //  return this.adminApiServie.delete(deleteUtenteUrl, id)
  //}
  public deletePerson(id: string): Observable<any> {
    return this.adminApiService.deleteFisic(deletePersonUrl, id)
  }
  public deleteOrg(id: string): Observable<any> {
    return this.adminApiService.delete(deleteOrgUrl, id)
  }

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
