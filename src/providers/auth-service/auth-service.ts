import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthServiceProvider {

	protocol   : string = "http://"; //var for protcol
	domainName : string = ""; //domain name or ipAddress

	constructor(public http: HttpClient) {
	}

	//the method to post data to the server 
	postData(domainName, credentials, endPoint){

		var apiUrl = this.protocol + domainName + "/Entry_REST/v1.0";

		return new Promise((resolve, reject) =>{

			this.http.post(apiUrl+endPoint, credentials).subscribe(result =>{
				resolve(result);
			}, (error) => {
				reject(error);
			})
		})
	}

}
