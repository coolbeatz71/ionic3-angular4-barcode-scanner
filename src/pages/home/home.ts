import { Component } from '@angular/core'; //import the main component
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@IonicPage()
@Component({
  selector: 'page-home', //link it to the css using selector 
  templateUrl: 'home.html', //link to the html which is a template
})
export class HomePage {

    userInfo:any; //instance var store userInfo like userName 
    //the constructor of the class
    constructor(public navCtrl: NavController, public navParams: NavParams, private app: App,
                private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController,
                private loadingCtrl: LoadingController, private authService: AuthServiceProvider,
                private modalCtrl: ModalController) {
        
        this.userInfo = this.navParams.get('value'); //receive the params coming for the loginPage
        console.log(this.userInfo); //help for debuging
    
    }

    //function to logout the user
    logout(){
        localStorage.clear(); //clearing info to the localStorage
        const root = this.app.getRootNav(); //bring user to the login page
        root.popToRoot();
    }

    //the function for scaning barcode 
    scanBarcode(){

        let ipAddress:string = localStorage.getItem("domainName"); //we get ip Address of the server
        console.log(ipAddress);

        //create the var for loading spinner
        let loading = this.loadingCtrl.create({
            content: '<ion-spinner></ion-spinner> Loading...',
        });        

        //text which is displayed inside the barcode scanner prompt 
        let options = {
            prompt: "Place the screen on the Barcode"
        }
        
        //we call the barcode scanner to scan or decode data and put it inside barcodeData
        this.barcodeScanner.scan(options).then((barcodeData) => {
            loading.present(); //we display the loader

            let credentials = {
                barcodeText: barcodeData.text //get the text inside the barcode
            }

            //after decoding the barcode code, we make an HTTP request to the server
            //using the provider (passing the ipAddress, barcodeText, endpoint)
            this.authService.postData(ipAddress, credentials, "/scanBarcode").then((result:any)=>{
                
                loading.dismiss(); //close the loader spinner

                //we check or we process the server result
                if(result.invalidBarcode == true){
                    //when the barcode is invalid 
                    let alert = this.alertCtrl.create({
                        title   : 'Invalid Barcode',
                        message : "No visitor found with this barcode",
                        buttons : ['Dismiss']
                    });
        
                    alert.present(); //display the error msg 

                }else if(result.error == false){
                    //on success, no error found, we display the modal and the result (personInfo)
                    var modalPage = this.modalCtrl.create('ModalPage', result.personalInfo);
                    modalPage.present();

                }

            }, (error)=>{
                //when server is not accessible
                let alert = this.alertCtrl.create({
                    title   : 'Oops!!',
                    message : "An error occured when connecting to the server",
                    buttons : ['Dismiss']
                });
        
                alert.present();
            });

        }, (err) => {
            //when we cannot scan the barcode 
            let alert = this.alertCtrl.create({
                title   : 'Oops!!',
                message : "An error occured when trying to scan barcode",
                buttons : ['Dismiss']
            });
        
            alert.present();
        });
    }
}