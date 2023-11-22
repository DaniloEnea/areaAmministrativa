import { Injectable } from '@angular/core';
import {AdminApiService} from "./admin-api.service";
import {Observable} from "rxjs";


// PATH API
let getUtenteUrl = "http://localhost:8080/api/utenti"
let addUtenteUrl = "http://localhost:8080/api/addUtenti"
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
