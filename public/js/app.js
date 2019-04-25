const nem = require('nem-sdk').default;
let address = document.querySelector('#address').value;
document.addEventListener('DOMContentLoaded', function(){
    $.getJSON(`https://cors.io/?http://23.228.67.85:7890/account/get?address=${address}`, function(res){
       console.log(res);
       $('#accountDetails').html(`<div class="well">
        <b>Balance</b>: ${res.account.balance}
        <br>
        <b>Importance</b>: ${res.account.importance}
        <br>
        <b>Harvested Blocks</b>: ${res.account.harvestedBlocks}
       </div>`);
    });
    $.getJSON(`https://cors.io/?http://23.228.67.85:7890/account/transfers/outgoing?address=${address}`, function(res){
        console.log(res);
        let data = '';
        for(let tx of res.data){
            
            if (tx.transaction.amount != undefined) {
                data += `<div class="well">`;
                data += `<b>Amount: </b>${tx.transaction.amount}<br>`
                data += `<b>Fee: </b>${tx.transaction.fee}<br>`
                data += `<b>Transaction Hash: </b>${tx.meta.hash.data}<br>`
                data += `</div>`
            }
        }
        $('#outgoingTransfers').html(data);
    });
    $.getJSON(`https://cors.io/?http://23.228.67.85:7890/account/transfers/incoming?address=${address}`, function(res){
        console.log(res);
        let data = '';
        for(let tx of res.data){
            data += `<div class="well">`;
            data += `<b>Amount: </b>${tx.transaction.amount}<br>`
            data += `<b>Fee: </b>${tx.transaction.fee}<br>`
            data += `<b>Transaction Hash: </b>${tx.meta.hash.data}<br>`
            data += `</div>`
        }
        $('#incomingTransfers').html(data);
    });
    
});

