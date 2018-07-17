import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

    id            = this.navParams.get('personalId');
    firstName     = this.navParams.get('firstName');
    lastName      = this.navParams.get('lastName');
    gender        = this.navParams.get('Gender');
    phoneNumber   = this.navParams.get('phoneNumber');
    nationalId    = this.navParams.get('nationalId');
    status        = this.navParams.get('status');
    date          = this.navParams.get('date');
    equipmentName = this.navParams.get('equipmentName');
    model         = this.navParams.get('model');
    serialNumber  = this.navParams.get('serialNumber');

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private viewCtrl: ViewController) {
    }

    closeModal(){
        this.viewCtrl.dismiss();
    }

}
