// Include the library
const nem = require("nem-sdk").default;


module.exports = {
    getEntity : function(privateKey, amount, recipientAddress){
        const endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
        const common = nem.model.objects.create("common")("", privateKey);
        // Create an un-prepared transfer transaction object
        let transferTransaction = nem.model.objects.create("transferTransaction")(recipientAddress, amount, "");
        // Prepare the transfer transaction object
        let transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
        // Serialize transfer transaction and announce
        return transactionEntity;
    }
}
