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
        'Authorization': 'Bearer eyJraWQiOiJiZWNjNTU4MC1iNjg4LTRkNTItYTAwMS03NDQwYTZhZTgyNGMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjbGllbnQtYW5ndWxhciIsImF1ZCI6ImNsaWVudC1hbmd1bGFyIiwibmJmIjoxNzAyNTYyNDU0LCJUZXN0IjoiVGVzdCBBY2Nlc3MgVG9rZW4iLCJzY29wZSI6WyJjbGllbnQucmVhZCIsImNsaWVudC53cml0ZSJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgyODIiLCJleHAiOjE3MDI1NjI3NTQsImlhdCI6MTcwMjU2MjQ1NCwidXNlciI6ImNsaWVudC1hbmd1bGFyIiwiYXV0aG9yaXRpZXMiOltdfQ.LGQvQxO0KZNPzCLj_6Ei-mHyE3Xk1BrwqcUwsIQMa10HykVwf0t1RglpFnL9xXgKqFGeduoSK54Ge44iUCQdiIkl8Tu8rA84xQjtIwFXnJvGEcGbxaXlaKnufpH5alGeB1Svp57iXEtAgM1I5Ipw1NjZ9SKCEA3YEdQO5e86OThW6tJ5PZxQkmV2hivYQWRsjXd162yC8-ATrxZNEmtpqB0nfd6MjGtVoQ1Dy9QdHaRNd1rdCY0HFQ-6eKKmjP7hbouwiWAUidN_R_byrv_hWEu2hSr_7ywbAwFo1teJ88ie9AzuYgL4FnQqnD5lSAqEfFEaoe89WB_dvjhGNOzi7A'
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
