import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import {Observable} from "rxjs";


// PATH API
let genericUrl = "http://localhost:8080/api/"

//get
let getUtenteUrl = genericUrl + "utenti"
//let getPersonUrl = genericUrl + "people"
let getPersonUrl = "https://localhost:7131/api/People"
let getOrgUrl = "https://localhost:7017/api/Organizations"
//let getOrgUrl = genericUrl + "organization"

//add
let addUtenteUrl = genericUrl + "addUtenti"
let addPersonUrl = "https://localhost:7131/api/People"
let addOrgUrl = genericUrl + "addOrganization"

/*details*/
//let getUtenteByIdUrl = genericUrl + "utenti"
//let getPersonByIdUrl = genericUrl + "person"
//let getOrgByIdUrl = genericUrl + "organization"

//update
let updateUtenteUrl = genericUrl + "updateUtenti"
let updatePersonUrl = "https://localhost:7131/api/People"
let updateOrgUrl = "https://localhost:7017/api/Organizations"

//delete
let deleteUtenteUrl = genericUrl + "deleteUtenti"
let deletePersonUrl = "https://localhost:7131/api/People"
let deleteOrgUrl = "https://localhost:7017/api/Organizations"

//login
let loginUrl = "http://localhost:9000/api/auth/login"

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private adminApiServie: AdminApiService) { }

  /* ALL METHOD API FOR USER'S */

  //GET
  public getAllUtente() : Observable<any> {
    return this.adminApiServie.get(getUtenteUrl)
  }
  public getAllPeople(): Observable<any> {
    return this.adminApiServie.get(getPersonUrl)
  }
  public getAllOrg(): Observable<any> {
    return this.adminApiServie.get(getOrgUrl)
  }

  //GET BY ID
  //public getUtenteByID( id: number): Observable<any> {
  //  return this.adminApiServie.getById(getUtenteByIdUrl, id)
  //}
  //public getPersonByID(id: number): Observable<any> {
  //  return this.adminApiServie.getById(getPersonByIdUrl, id)
  //}
  //public getOrgByID(id: number): Observable<any> {
  //  return this.adminApiServie.getById(getOrgByIdUrl, id)
  //}

  //POST
  public addNewUser(model: any) : Observable<any> {
    return this.adminApiServie.post(addUtenteUrl, model)
  }
  public addNewPerson(model: any): Observable<any> {
    return this.adminApiServie.post(addPersonUrl, model)
  }
  public addNewOrg(model: any): Observable<any> {
    return this.adminApiServie.post(addOrgUrl, model)
  }

  public login(model:any): Observable<any> {
    return this.adminApiServie.post(loginUrl, model)
  }

  //PUT
  //public updateUser(id: number, model : any) : Observable<any> {
  // return this.adminApiServie.put(updateUtenteUrl,id, model)
  //}
  public updatePerson(id: string, model: any): Observable<any> {
   return this.adminApiServie.put(updatePersonUrl,id, model)
  }
  public updateOrg(id: string, model: any): Observable<any> {
    return this.adminApiServie.put(updateOrgUrl, id, model)
  }

  //DELETE
  //public deleteUser(id: number) : Observable<any> {
  //  return this.adminApiServie.delete(deleteUtenteUrl, id)
  //}
  public deletePerson(id: string): Observable<any> {
    return this.adminApiServie.deleteFisic(deletePersonUrl, id)
  }
  public deleteOrg(id: string): Observable<any> {
    return this.adminApiServie.delete(deleteOrgUrl, id)
  }


}
