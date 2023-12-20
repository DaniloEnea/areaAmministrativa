import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  constructor(private http: HttpClient) { }

  /*  ALL METHOD API  */
  get(url: string): Observable<any> {
    const httpOpstions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body'
    };

    return this.http.get(url, httpOpstions).pipe(
    map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  //POST operations
  post(url: string, model:any): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body'
    };

    return this.http.post(url, model, httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

    postWithCc(url: string, model:any): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiM2QyN2Y5Yi1kMjFkLTMyN2MtMTY0ZS03ZmI2Nzc2Zjg3YjkiLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlzcyI6Im15QXBwIiwibmFtZSI6ImRhbmlsbyIsImV4cCI6MTcwMzA2OTQyNiwiaWF0IjoxNzAzMDY4NTI2fQ.lw9tokl90r3m8KBYtm-ttbddE1PdcD0xZxhPjQK8QfEmUEmapj_6vBRK1B0Fx-2BU000ruqwn7C2ppCJYWcl6ixqn0Jitk-Un86yI_cWjSpWhkyt4fa4Dk7npuLtuvR6sLu2Q0rH3S9OxuwKDpXWcPv8w0OB3VSE3pD5VsOS7Z62k-_hfIBJArQ2Ir5LIoe_7LEGvOuRV-7ZRNrPLdho4Y21X8G1J1kQ6B_zKnJI2moSxkInxyuEdP-akIJLxiKotKb7q-a-9eZ1Fc8dhoEckmLRC2S5nPRWnsEq2gwSgPgWNiJs6K8waqx97GqKTKgXjRxr_0-LQ6jbl0eSzHSDMw'
      }),
      observe: "response" as 'body'
    };

    return this.http.post(url, model, httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

      // PUT operations
    put(url: string, id: string, model :any): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response' as 'body'
      };
      const putUrl = `${url}/${id}`;
      return this.http.put(putUrl, model, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

  // DELETE operations
  delete(url: string, id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    const deleteUrl = `${url}/${id}`;
    return this.http.delete(deleteUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE fisic operations
  deleteFisic(url: string, id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    const deleteUrl = `${url}/${id}?logicalDelete=false`;
    return this.http.delete(deleteUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

    // GET BY ID operations
    getById(url: string, id: number): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response' as 'body'
      };
      const getUrl = `${url}/${id}`;
      return this.http.get(getUrl, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    /*getFiltered(url:string, endUrl: string): Observable<any>{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response' as 'body'
      };
      const getUrl = `${url}?${endUrl}`;
      console.log(getUrl);
      return this.http.get(getUrl, httpOptions).pipe(
        catchError(this.handleError));
    }*/


  // functions
  private ReturnResponseData(response: any) {
    return response;
  }

  private handleError(error :any){
    return throwError(error);
  }
}
