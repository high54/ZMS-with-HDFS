import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientProvider } from '../../providers/client';
import { FilesProvider } from '../../providers/files';
/**
 * Generated class for the List page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class List {
  private filesService = this.client.getInstance().createAsyncMacroService({
      Type: FilesProvider,
      deploymentId: 'macro_0'
  }) as FilesProvider;
  imgs:any;
  constructor(public navCtrl: NavController,public client:ClientProvider, public navParams: NavParams) {
    this.filesService.listFiles("/").then((result) => {
    this.imgs = result.listing.entries.content;
    console.log(this.imgs)
    }).catch((error) => {
        console.error(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad List');
  }

}
