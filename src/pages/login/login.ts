import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@IonicPage()
@Component({
	selector: "page-login",
	templateUrl: "login.html"
})
export class LoginPage {
	
    formGroup : FormGroup;
    userName  : AbstractControl;
    password  : AbstractControl;
    ipAddress : string;

    endPoint  : string = "/loginUser";

    responseData = {}; 

    constructor(private navCtrl : NavController, public formBuilder: FormBuilder, 
                public navParams: NavParams, private authService: AuthServiceProvider,
                private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

        this.formGroup = formBuilder.group({
            userName : ['', Validators.required],
            password : ['', Validators.required]
        });

        this.userName = this.formGroup.controls['userName'];
        this.password = this.formGroup.controls['password'];
        
    }

	ionViewCanEnter() {
		var item = localStorage.getItem('credentials');
        
        if(item == "" || item == undefined){
            return true;
        }else{
            return false;
        }
	}

    showAlert(message){

        let alert = this.alertCtrl.create({
            title   : 'Oops!!',
            message : message,
            buttons : ['Dismiss']
        });
        
        alert.present();
    }

    userLogin(){

        if(this.ipAddress == "" || this.ipAddress == undefined){
        
            this.showAlert("please, ip address is required!");
        
        }else if(!(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.ipAddress))){

            this.showAlert("This ip address is incorrect! try another");

        }else{

            let loading = this.loadingCtrl.create({
                content: '<ion-spinner></ion-spinner> Loading...',
            });        

            loading.present();

            let credentials = {
                "userName" : this.userName.value,
                "password" : this.password.value
            }

            this.authService.postData(this.ipAddress, credentials, this.endPoint).then((result:any) => {
                loading.dismiss();
               
                if(result.error == false){

                    this.responseData = result;
                    localStorage.setItem("credentials", result.apiKey);
                    localStorage.setItem("domainName", this.ipAddress);
                    this.navCtrl.push("HomePage", {
                        "value": this.responseData 
                    });

                }else{

                    if(result.errorUserName){
                        
                        this.showAlert("incorrect user name, try again");

                    }else if(result.errorPass){

                        this.showAlert("incorrect password, try again");
                    }
                }

            }, (error) => {
                loading.dismiss();
                this.showAlert("Error when loading the server");
            });
        }

    }
}