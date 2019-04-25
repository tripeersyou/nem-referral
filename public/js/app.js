const nem = require('nem-sdk').default;
let address = document.querySelector('#address').value;
document.addEventListener('DOMContentLoaded', function(){
   const connect = (connector) => {
        return connector.connect().then(() =>{
            nem.com.websockets.subscribe.account.data(connector, function(res) {
                console.log(res);
            });
            nem.com.websockets.subscribe.account.transactions.recent(connector, function(res){
                console.log(res);
            });
            nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function(res) {
                console.log(res);
            });
            nem.com.websockets.subscribe.account.transactions.confirmed(connector, function(res) {
                console.log(res);
            });
        });
       
   }
   
   const start = () =>{
       var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);
       var account_address = nem.model.address.clean(address);
       var connector = nem.com.websockets.connector.create(endpoint, account_address);
       connect(connector);
   }
   
   start();
});

