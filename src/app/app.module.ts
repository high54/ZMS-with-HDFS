import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Camera} from '@ionic-native/camera';
import {Transfer} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { List } from '../pages/list/list';
import { ClientProvider } from '../providers/client';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    List
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    List
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    ClientProvider,
    Transfer,
    File,
    FilePath
  ]
})
export class AppModule {}
