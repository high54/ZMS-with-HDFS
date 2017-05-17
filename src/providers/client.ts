import { SmartClient } from 'zetapush-js';




export class ClientProvider {
    client: SmartClient;



    public getInstance() {
        if (typeof this.client === "undefined" && this.client == null) {
            this.client = new SmartClient({
                sandboxId: 'IBBVcVOl',
                apiUrl: 'https://api.zpush.io/'
            })
        }
        return this.client;
    }
}
