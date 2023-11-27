import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import {Observable} from "rxjs";


// PATH API
let genericUrl = "http://localhost:8080/api/"

//get
let getUtenteUrl = genericUrl + "utenti"
let getPersonUrl = genericUrl + "people"
let getOrgUrl = genericUrl + "organization"

//add
let addUtenteUrl = genericUrl + "addUtenti"
let addPersonUrl = genericUrl + "addPerson"
let addOrgUrl = genericUrl + "addOrganization"

//details
let getUtenteByIdUrl = genericUrl + "utenti/"
let getPersonByIdUrl = genericUrl + "person/"
let getOrgByIdUrl = genericUrl + "organization/"

//update
let updateUtenteUrl = genericUrl + "updateUtenti/"
let updatePersonUrl = genericUrl + "updatePerson/"
let updateOrgUrl = genericUrl + "updateOrganization/"

//delete
let deleteUtenteUrl = genericUrl + "deleteUtenti/"
let deletePersonUrl = genericUrl + "deletePerson/"
let deleteOrgUrl = genericUrl + "deleteOrganization/"

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private adminApiServie: AdminApiService) { }

  /* ALL METHOD API FOR USER'S */

  //GET for all user
  public getAllUtente() : Observable<any> {
    return this.adminApiServie.get(getUtenteUrl)
  }

  //POST for add new user
  public addNewUser(model: any) : Observable<any> {
    return this.adminApiServie.post(addUtenteUrl, model)
  }


}
