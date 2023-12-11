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


  // functions
  private ReturnResponseData(response: any) {
    return response;
  }

  private handleError(error :any){
    return throwError(error);
  }
}
