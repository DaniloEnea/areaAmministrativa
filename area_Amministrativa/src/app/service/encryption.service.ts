import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import cryptoKeys from '../../assets/CryptoKeys.json';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(private http: HttpClient) { }

  private backPublicKey!: string;
  private privateKey: string = cryptoKeys.PrivateKey;
  public publicKey: string = cryptoKeys.PublicKey;

  //private async encryptData(plainText: string): Promise<string> {
  //    const data = new TextEncoder().encode(plainText);

  //    return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, this.rsa.publicKey, data)
  //        .then((encryptedData) => {
  //            return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedData)));
  //        })
  //        .catch(error => {
  //            console.error('Errore durante la crittografia:', error);
  //            throw error;
  //        });
  //}

  // Function to convert a CryptoKey to PEM format using node-forge

  private exportKeyToPEM = async (key: CryptoKey, type: string): Promise<string> => {
    let exported: ArrayBuffer;

    if (type === 'PUBLIC') {
      if (key.type !== 'public') {
        throw new Error('Expected a public key');
      }
      exported = await crypto.subtle.exportKey('spki', key);

      // Convert the exported ArrayBuffer to a Uint8Array
      const exportedAsUint8Array = new Uint8Array(exported);

      // Convert the Uint8Array to a Forge buffer
      const exportedAsForgeBuffer = forge.util.createBuffer(exportedAsUint8Array);

      // Convert the Forge buffer to a Forge key object
      const forgeKey = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(exportedAsForgeBuffer));

      // Convert the Forge key object to PEM format
      const pemString = forge.pki.publicKeyToPem(forgeKey);

      return pemString;

    } else if (type === 'PRIVATE') {
      if (key.type !== 'private') {
        throw new Error('Expected a private key');
      }
      exported = await crypto.subtle.exportKey('pkcs8', key);

      // Convert the exported ArrayBuffer to a Uint8Array
      const exportedAsUint8Array = new Uint8Array(exported);

      // Convert the Uint8Array to a Forge buffer
      const exportedAsForgeBuffer = forge.util.createBuffer(exportedAsUint8Array);

      // Convert the Forge buffer to a Forge key object
      const forgeKey = forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(exportedAsForgeBuffer));

      // Convert the Forge key object to PEM format
      const pemString = forge.pki.privateKeyToPem(forgeKey);

      return pemString;

    } else {
      throw new Error('Invalid key type');
    }
  };

  public async generateAndSetKeys(): Promise<void> {
    try {
      // Step 1: Generate public and private keys
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Export public and private keys to PEM format
      const publicKeyPEM = await this.exportKeyToPEM(keyPair.publicKey, 'PUBLIC');
      const privateKeyPEM = await this.exportKeyToPEM(keyPair.privateKey, 'PRIVATE');

      const publicKey = await this.pemToBase64(publicKeyPEM);
      const privatekey = await this.pemToBase64(privateKeyPEM);

      console.log("Public generated: " + publicKey);
      console.log("Private generated: " + privatekey);

    } catch (error) {
      console.error('Error generating and converting keys:', error);
      throw error;
    }
  }

  private async pemToBase64(pem: string): Promise<string> {
    // Extract the Base64 content between "-----BEGIN ... KEY-----" and "-----END ... KEY-----"
    const base64Content = await pem.split('\n').slice(1, -2).join('');
    return base64Content;

  }

  public async encryptRSASplit(obj: string, backUrl: string): Promise<string> {

    await this.getPublicKey(backUrl);

    // Convert the public key PEM string to a PublicKey object
    /*const publicKeyObject = forge.pki.publicKeyFromPem(this.backPublicKey);*/

    // Convert the DER-encoded public key string to a ByteString
    const publicKeyBytes = forge.util.decode64(this.backPublicKey);

    // Parse the DER-encoded public key ByteString to an ASN.1 object
    const publicKeyAsn1 = forge.asn1.fromDer(publicKeyBytes);

    // Convert the DER-encoded public key to a PublicKey object
    const publicKeyObject = forge.pki.publicKeyFromAsn1(publicKeyAsn1);

    if (obj.length > 100) {
      const chunkSize = 100; // Adjust the chunk size as needed
      const chunks = this.split(obj, chunkSize);

      let stringdata = '';
      chunks.forEach(function (value) {

        const encryptedData = publicKeyObject.encrypt(value, 'RSAES-PKCS1-V1_5', {
          md: forge.md.sha256.create(),
        });
        stringdata = stringdata + forge.util.encode64(encryptedData) + '&';
      });

      return stringdata.slice(0, -1);
    }

    const cryptodata = publicKeyObject.encrypt(obj, 'RSAES-PKCS1-V1_5', {
      md: forge.md.sha256.create(),
    });

    return forge.util.encode64(cryptodata);
    // Split the JSON string into chunks


    //// Encrypt each chunk separately
    //const encryptedChunks = chunks.map(chunk => {
    //    // Encrypt the chunk with RSA
    //    const encryptedData = publicKeyObject.encrypt(chunk, 'RSAES-PKCS1-V1_5', {
    //        md: forge.md.sha256.create(),
    //    });

    //    // Return the encrypted data as base64
    //    return forge.util.encode64(encryptedData);
    //});

    //// Combine all encrypted chunks with '&'
    //return encryptedChunks.join('&');
  }

  public async encryptRSAlocalKey(obj: string, key: string): Promise<string> {

    // Convert the DER-encoded public key string to a ByteString
    const publicKeyBytes = forge.util.decode64(key);

    // Parse the DER-encoded public key ByteString to an ASN.1 object
    const publicKeyAsn1 = forge.asn1.fromDer(publicKeyBytes);

    // Convert the DER-encoded public key to a PublicKey object
    const publicKeyObject = forge.pki.publicKeyFromAsn1(publicKeyAsn1);

    if (obj.length > 100) {
      const chunkSize = 100; // Adjust the chunk size as needed
      const chunks = this.split(obj, chunkSize);

      let stringdata = '';
      chunks.forEach(function (value) {

        const encryptedData = publicKeyObject.encrypt(value, 'RSAES-PKCS1-V1_5', {
          md: forge.md.sha256.create(),
        });
        stringdata = stringdata + forge.util.encode64(encryptedData) + '&';
      });

      return stringdata.slice(0, -1);
    }

    const cryptodata = publicKeyObject.encrypt(obj, 'RSAES-PKCS1-V1_5', {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(cryptodata);
  }

  public decryptRSASplit(encryptedData: string): any {

    // Convert the DER-encoded private key string to a ByteString
    const privateKeyBytes = forge.util.decode64(this.privateKey);

    // Parse the DER-encoded private key ByteString to an ASN.1 object
    const privateKeyAsn1 = forge.asn1.fromDer(privateKeyBytes);

    // Convert the DER-encoded private key to a PrivateKey object
    const privateKeyObject = forge.pki.privateKeyFromAsn1(privateKeyAsn1);

    // Handle data in case the string was split during encryption
    if (String(encryptedData).includes('&')) {
      const encryptedChunks = encryptedData.split('&');

      let summedString = "";
      encryptedChunks.forEach(function (value) {
        const encryptedDataBinary = forge.util.decode64(value);
        const decryptedData = privateKeyObject.decrypt(encryptedDataBinary, 'RSAES-PKCS1-V1_5', {
          md: forge.md.sha256.create(),
        });
        summedString += forge.util.decodeUtf8(decryptedData);
      });

      return summedString;
    }

    // Decrypt the data
    const encryptedDataBinary = forge.util.decode64(encryptedData);
    const decryptedData = privateKeyObject.decrypt(encryptedDataBinary, 'RSAES-PKCS1-V1_5', {
      md: forge.md.sha256.create(),
    });

    return forge.util.decodeUtf8(decryptedData);

    // Split the encrypted data into chunks


    //// Decrypt each chunk separately
    //const decryptedChunks = encryptedChunks.map(chunk => {
    //    // Decode the base64-encoded encrypted data
    //    const encryptedDataBinary = forge.util.decode64(chunk);

    //    // Decrypt the chunk with RSA
    //    const decryptedData = privateKeyObject.decrypt(encryptedDataBinary, 'RSAES-PKCS1-V1_5', {
    //        md: forge.md.sha256.create(),
    //    });

    //    return decryptedData;
    //});

    //// Combine all decrypted chunks
    //return decryptedChunks.join('');
  }

  //public async encryptEmailRSASplit(email: string, backUrl: string): Promise<string> {

  //    await this.getPublicKey(backUrl);
  //    const publicKeyBytes = forge.util.decode64(this.backPublicKey);
  //    const publicKeyAsn1 = forge.asn1.fromDer(publicKeyBytes);
  //    const publicKeyObject = forge.pki.publicKeyFromAsn1(publicKeyAsn1);

  //    const chunkSize = 100;
  //    const chunks = this.split(email, chunkSize);

  //    let stringdata = '';
  //    chunks.forEach(function (value) {
  //        // Ensure proper encoding of the string to bytes
  //        const valueBytes = new TextEncoder().encode(value).toString();

  //        const encryptedData = publicKeyObject.encrypt(valueBytes, 'RSAES-PKCS1-V1_5', {
  //            md: forge.md.sha256.create(),
  //        });

  //        stringdata = stringdata + forge.util.encode64(encryptedData) + '&';
  //    });

  //    return stringdata.slice(0, -1);
  //}

  //public decryptEmailRSASplit(encryptedData: string): string {
  //    // Convert the DER-encoded private key string to a ByteString
  //    const privateKeyBytes = forge.util.decode64(this.privateKey);

  //    // Parse the DER-encoded private key ByteString to an ASN.1 object
  //    const privateKeyAsn1 = forge.asn1.fromDer(privateKeyBytes);

  //    // Convert the DER-encoded private key to a PrivateKey object
  //    const privateKeyObject = forge.pki.privateKeyFromAsn1(privateKeyAsn1);

  //    // Split the encrypted data into chunks
  //    const encryptedChunks = encryptedData.split('&');

  //    // Decrypt each chunk separately
  //    const decryptedChunks = encryptedChunks.map(chunk => {
  //        // Decode the base64-encoded encrypted data
  //        const encryptedDataBinary = forge.util.decode64(chunk);

  //        // Decrypt the chunk with RSA
  //        const decryptedDataBytes = privateKeyObject.decrypt(encryptedDataBinary, 'RSAES-PKCS1-V1_5', {
  //            md: forge.md.sha256.create(),
  //        }) as unknown as Uint8Array;  // Explicitly cast to Uint8Array

  //        // Convert the decrypted bytes to a string
  //        const decryptedData = new TextDecoder().decode(decryptedDataBytes);

  //        return decryptedData;
  //    });

  //    // Combine all decrypted chunks
  //    return decryptedChunks.join('');
  //}

  private split(str: string, chunkSize: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < str.length; i += chunkSize) {
      const length = Math.min(chunkSize, str.length - i);
      result.push(str.substr(i, length));
    }

    return result;
  }

  private async getPublicKey(backUrl: string): Promise<void> {
    try {
      const response: any = await this.http.get(backUrl, { responseType: 'text' }).toPromise();
      this.backPublicKey = response;
    } catch (error) {
      console.error('Error fetching public key:', error);
      throw new Error('Failed to fetch public key from the server');
    }
  }
}

