# ZMS-with-HDFS
How to use HDFS with ZetaPush


# Introduction

In this tutorial, you need to know how to work with ZMS, and Ionic 3. We make a simple mobile app with data send and receive.

# <span id="Before_we_get_started">Before we get started</span>

Before you go through this tutorial, you should have at least a basic understanding of Ionic 3 concepts. You must also already have Ionic 3 set up on your machine. If you’re not familiar with Ionic 3 already, I’d recommend reading my [Getting started with ZMS and Ionic 3](https://www.why-me.tech/getting-started-with-ionic-3-and-zms/) first to get up and running and understand the basic concepts. Or [Configure your work environment for ZMS](https://www.why-me.tech/configure-your-work-environment-for-zms/)

# ZMS and Eclipse

We need to deploy our noSql service on Eclipse. Inside recipe.zms declare our service :

<pre class="prettyprint">/** a NoSql database */
service nosql_db = gda(__default).forbiddenVerbs(__all);</pre>

  Before declaring the macroscript we need to create the table : In init.zms :

<pre class="prettyprint">nosql_db.gda_createTable({
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
});</pre>

Here we declare a new table 'testGdaTable' with 2 columns 'firstColumn' and 'secondColumn'. We need to deploy it on ZetaPush servers ! ![](https://www.why-me.tech/wp-content/uploads/2017/04/outilsZMS.png) Click on the red rocket icon. After working, the console shows you a big success :

<pre class="prettyprint">[INFO] ***************************
[INFO] **        SUCCESS        **
[INFO] ***************************</pre>

Now we can create some macroscripts to put, get and list the data.

<pre class="prettyprint">macroscript put(number key, string firstString, string secondString)
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
} return { result }</pre>

We have two macroscripts, the first one puts the data in the table and the second one gets the data from the table with the key.  

# Ionic 3

At this time we have configured the database and our macroscripts. Now it's time to interact with our application. We add a new provider at our Ionic app :

<pre class="prettyprint">import { services } from 'zetapush-js';

export class GdaProvider extends services.Macro {

 put(key,firstString, secondString) {
 this.$publish('put', {key, firstString, secondString });
 }
 get(key) {
 return this.$publish('get', { key });
 }
}
</pre>

And we can use it on our app :

<pre class="prettyprint">  private gdaService = this.client.getInstance().createAsyncMacroService({
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

 }</pre>

Open the console of your browser and you should see the result of our query. In a few minutes you have set up a database service and used it in your application !
