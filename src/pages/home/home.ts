import { Component } from '@angular/core';
import { NavController, ActionSheetController, Loading, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ClientProvider } from '../../providers/client';
import { FilesProvider } from '../../providers/files';
import { Transfer, TransferObject, FileUploadOptions } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Platform } from 'ionic-angular';
import {List } from '../list/list';
declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private filesService = this.client.getInstance().createAsyncMacroService({
        Type: FilesProvider,
        deploymentId: 'macro_0'
    }) as FilesProvider;
    public fileTransfer: TransferObject = this.transfer.create()
    lastImage: string = null;
    loading: Loading;
    constructor(public navCtrl: NavController, public file: File,public modalCtrl:ModalController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public camera: Camera, public actionSheetCtrl: ActionSheetController, public client: ClientProvider, public transfer: Transfer, public filePath: FilePath, public platform: Platform) {
        this.client.getInstance().connect();
        this.client.getInstance().addConnectionStatusListener({
            onConnectionEstablished: () => {
                this.filesService.listFiles("/").then((result) => {
                    console.log(result);
                }).catch((error) => {
                    console.error(error);
                });


            },
            onFailedHandshake: error => {
                console.error(error);
            },
            onConnectionClosed: () => {
                this.client.getInstance().connect();
            }
        });
    }
    public showFile()
    {
      let modal = this.modalCtrl.create(List);
      modal.present();
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }
    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpeg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }
    public uploadImage() {

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;
        console.log(filename);


        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        this.filesService.uploadFile("/").then((result) => {
          let uploadUrl = result.upload.url;
          var options : FileUploadOptions;
          options = {
            fileKey : 'file',
            httpMethod : result.upload.httpMethod,
            mimeType : 'image/jpeg',
            chunkedMode : false,
            fileName:filename,
            headers:{'Content-Type': 'image/jpeg'}
          }
          console.log(result)
            this.fileTransfer.upload(targetPath, encodeURI(uploadUrl),options,true).then(data => {
                this.loading.dismissAll()
                          this.filesService.addFile(result.upload.guid).then((result)=>{
                            console.log(result)
                          }).catch((error)=>
                        {
                          console.error(error)
                        })
                this.presentToast('Image succesful uploaded.');
            }, err => {
                this.loading.dismissAll()
                console.log(err)
                this.presentToast('Error while uploading file.<br/>');
            });
        }).catch((error) => {
            console.error(error)
        })
    }
}
