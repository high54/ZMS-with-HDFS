# ZMS-with-HDFS
How to use HDFS with ZetaPush


Introduction
In this tutorial, you need to know how to work with ZMS, and Ionic 3.
We make a simple mobile app with data send and receive.
Before we get started
Before you go through this tutorial, you should have at least a basic understanding of Ionic 3 concepts. You must also already have Ionic 3 set up on your machine.
If you’re not familiar with Ionic 3 already, I’d recommend reading my Getting started with ZMS and Ionic 3 first to get up and running and understand the basic concepts.
ZMS and Eclipse
We need to deploy our noSql service on Eclipse.
Inside recipe.zms, we declare our service :
/** a NoSql database */
service nosql_db = gda(__default).forbiddenVerbs(__all);

Before declaring the macroscript we need to create the table :
In init.zms :
nosql_db.gda_createTable({
	name: 'testGdaTable',
	columns: [{
		map: false,
		name: 'firstColumn',
		type: GdaDataType_STRING
	},
	{
		name: 'secondColumn',
		map: false,
		type: GdaDataType_STRING
	}]
});
Here we declare a new table 'testGdaTable' with 2 columns 'firstColumn' and 'secondColumn'.
We need to deploy it on ZetaPush servers !

Click on the red rocket icon.
After working, the console shows you a big success :
[INFO] ***************************
[INFO] **        SUCCESS        **
[INFO] ***************************
Now we can create some macroscripts to put, get and list the data.
macroscript put(number key, string firstString, string secondString)
{
 nosql_db.puts({
 'table' : 'testGdaTable',
 'rows' : [
 {
 'key' : key,
 'data' : { 'firstColumn' :firstString,
 'secondColumn' : secondString
 }
 }
 ]
 });
}

macroscript get(number key)
{
 var result = nosql_db.get({
 'table' : 'testGdaTable',
 'key' : key
 });
} return { result }
We have two macroscripts : the first one puts the data in the table and the second one gets the data from the table with the key.

Ionic 3
At this time we have configured the database and our macroscript. Now it's time to interact with our application.
We add a new provider at our Ionic app :
import { services } from 'zetapush-js';

export class GdaProvider extends services.Macro {

 put(key,firstString, secondString) {
 this.$publish('put', {key, firstString, secondString });
 }
 get(key) {
 return this.$publish('get', { key });
 }
}


And we can use it on our app :
 private gdaService = this.client.getInstance().createAsyncMacroService({
      Type: GdaProvider,
      deploymentId: 'macro_0'
  }) as GdaProvider;

 constructor(public navCtrl: NavController, private client: ClientProvider) {
 this.client.getInstance().connect();
 this.client.getInstance().addConnectionStatusListener({
 onConnectionEstablished: () => {
 this.gdaService.put(20170502,"first test", "seconde test");
 this.gdaService.get(20170502).then((result)=>
 {
 console.log(result);
 }).catch((error)=>
 {
 console.error(error)
 })
 },
 onFailedHandshake: error => {
 console.error(error)
 },
 onConnectionClosed: () => {
 this.client.getInstance().connect();
 }
 });


 }
Open the console of your browser and you should see the result of our query.
In a few minutes you have set up a database service and used it in your application !
