import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import { EncryptionService } from './encryption.service';
import {BodyDtoEncrypt} from "../dto/body-dto-encrypt";


@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  //inserire token qui
  bearerToken: string = ""


  constructor(private http: HttpClient, private encryptionService: EncryptionService) { }

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

  /*  ALL METHOD API  */
  async get(url: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body',
      responseType: "text" as 'json'
    };

    try {
      const response = await this.http.get(url, httpOptions).toPromise();
      return this.ReturnResponseData(response);
    } catch (error) {
      this.handleError(error);
      throw error; // Rilancia l'errore per gestirlo nell'ambito in cui è stata chiamata la funzione
    }
  }

  async getByEmail(url: string, email: string): Promise<Observable<any>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    try {

      url = `${url}/${email}`;
      const response = await this.http.get(url, httpOptions).toPromise();
      return this.ReturnResponseData(response);
    } catch (error) {
      this.handleError(error);
      throw error; // Rilancia l'errore per gestirlo nell'ambito in cui è stata chiamata la funzione
    }
  }

  //POST operations
  post(url: string, body:any): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body',
      responseType: 'text' as 'json'
    };

    return this.http.post(url, body, httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  async postEncrypted(url: string, body: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body',
      responseType: 'text' as 'json'
    };

    try {
      const response = await this.http.post(url, body, httpOptions).toPromise();
      return this.ReturnResponseData(response);
    } catch (error) {
      this.handleError(error);
      throw error; // Rilancia l'errore per gestirlo nell'ambito in cui è stata chiamata la funzione
    }
  }

  postWithCc(url: string, model: any, accessToken: string): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }),
      responseType: 'text' as 'json'
    };

    return this.http.post(url, model, httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }


  postWithCcById(id: string, url: string, model: any, accessToken: string): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: "response" as 'body'
    };
    const postUrl: string = `${url}/${id}`;
    return this.http.post(postUrl, model , httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  postWithCcBodyEncrypt(url: string, model: any, accessToken: string): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: "response" as 'body'
    };

    return this.http.post(url, JSON.stringify(model) , httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }


  getWithCc(url: string, accessToken: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: "response" as 'body'
    };

    return this.http.get(url, httpOptions).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  getByIDWithCc(url: string, id: string, accessToken: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: "response" as 'body'
    };

    url = `${url}/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  putWithCc(url: string, id: string, model: any, accessToken: string): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: "response" as 'body'
    };

    const putUrl: string = `${url}/${id}`;
    return this.http.put(putUrl, model, httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  putCc(url: string, model: any, accessToken: string): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: "response" as 'body'
    };

    return this.http.put(url, model, httpOptions).pipe(
      map((response : any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  async putEncrypted(url: string, id: string, body: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body',
      responseType: 'text' as 'json'
    };


    const putUrl = `${url}/${id}`;

    try {
      const response = await this.http.put(putUrl, body, httpOptions).toPromise();
      return this.ReturnResponseData(response);
    } catch (error) {
      this.handleError(error);
      throw error; // Rilancia l'errore per gestirlo nell'ambito in cui è stata chiamata la funzione
    }
  }

 getCc(url: string, accessToken: string, tokenQueryParam: string): Observable<any> {
    const fullUrl = `${url}?token=${tokenQueryParam}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(fullUrl, httpOptions).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

 postUrlEncoded(url: string): Observable<any> {
    // Converti l'oggetto in formato URL-encoded
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', 'client-angular')
      .set('client_secret', 'secret')
      .set('scope', 'client.write');

    // Imposta le intestazioni per il tipo di contenuto
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    // Effettua la richiesta POST
    return this.http.post(url, body.toString(), { headers, observe: 'response' }).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  putUrlEncoded(url: string): Observable<any> {
    // Converti l'oggetto in formato URL-encoded
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', 'client-angular')
      .set('client_secret', 'secret')
      .set('scope', 'client.write');

    // Imposta le intestazioni per il tipo di contenuto
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    // Effettua la richiesta POST
    return this.http.put(url, body.toString(), { headers, observe: 'response' }).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  getUrlEncoded(url: string): Observable<any> {
    // Converti l'oggetto in formato URL-encoded
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', 'client-angular')
      .set('client_secret', 'secret')
      .set('scope', 'client.read');

    // Imposta le intestazioni per il tipo di contenuto
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    // Effettua la richiesta POST
    return this.http.post(url, body.toString(), { headers, observe: 'response' }).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

      // PUT operations
    put(url: string, id: string, model :any): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: "response" as 'body',
        responseType: 'text' as 'json'
      };
      const putUrl = `${url}/${id}`;
      return this.http.put(putUrl, model, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

  //PATCH operations
  patch(url: string, id: string, propertyname: string, newvalue: boolean, publickey: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body',
      responseType: 'text' as 'json'
    };
    url = `${url}/${id}?propertyName=${propertyname}&newValue=${newvalue}&publicKeyUrl=${publickey}`;


    return this.http.patch(url, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE operations
  deleteEncrypted(url: string, id: string, publicKeyUrl: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response" as 'body',
      responseType: 'text' as 'json'
    };
    const deleteUrl = `${url}/${id}?logicalDelete=false&publicKeyUrl=${publicKeyUrl}`;
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
    getById(url: string, id: string): Promise<Observable<any>> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response' as 'body',
        responseType: "text" as 'json'
      };

      try {
        url = `${url}/${id}?valid=true`;
        const response = this.http.get(url, httpOptions).toPromise();
        return this.ReturnResponseData(response);
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    }

  //public checkUserExists(url: string, id: string, ): Observable<boolean> {
  //  const httpOptions = {
  //    headers: new HttpHeaders({
  //      'Content-Type': 'application/json'
  //    }),
  //    observe: 'response' as 'body',
  //    responseType: "text" as 'json'
  //  };

  //  url = `${url}/${id}?valid=true`;
  //  return this.http.get<boolean>(url, httpOptions)
  //    .pipe(
  //      catchError((error) => {
  //        console.error('Error checking user existence:', error);
  //        return new Observable<boolean>((observer) => {
  //          observer.next(false);
  //        });
  //      })
  //    );
  //}

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
