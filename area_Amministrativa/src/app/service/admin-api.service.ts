import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  bearerToken: string = "eyJraWQiOiIzNTk2NWZmOS04MGYwLTRjMTItYjRkMS05OTk1YmVjZjFlNzYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjbGllbnQtYW5ndWxhciIsImF1ZCI6ImNsaWVudC1hbmd1bGFyIiwibmJmIjoxNzAzMTY4MDE1LCJzY29wZSI6WyJjbGllbnQucmVhZCIsImNsaWVudC53cml0ZSJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgyODIiLCJleHAiOjE3MDMxNjgzMTUsImlhdCI6MTcwMzE2ODAxNX0.LUC93ycRK8f9GPZyWx_kq6BREDxYb2eQzeoI1hOPDdjI8bkTUlV305s_3YXZPtGpSf5HxTa7DqAuJmlnfODN4iDuwj0hWxUYNW3p6KrU6Me9rie_kBfHB8ToHMMV9V4RzKfSEbyoo5wdHztzAr6SmRetEYM6s7dBSf6EgVt8eELhI1bXhaCPeul3QrepWdeepERqKjnrZhULa1OPBIjoA9-g8d4X-AlOhJEdSYy8Lf21SkNL5ZAfJhUqAKLRk6zn9P3UxDO-2mlHZtJ1mx9U2JWAEB913HlwE4wEchQ_pkShrUDXHLRrh-B26CqgcOrfhzCoj28bQ3ROajMGX0b6rg"
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

  postWithCc(url: string, model: any): Observable<any> {

    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.bearerToken
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
