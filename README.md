# logware-js
API Wrapper for the Logware.io API.  The module currently only supports callbacks but I may add async/await in the future.

For full documentation see the Logware.io docs: https://docs.logware.io/instructions/

**Important Notes**
* The logware.insertData() can store a payload no larger than 2kb. Sometimes extra headers data get added so if your payload is very close to 2kb and you are getting errors your payload is probably too large. Reduce the size and try again."

* it is recommended you encode your dataset with base64 encoding to protect against special characters. Be sure to know that base64 data is still public, so if you want your data to remain private, encrypt the base64 payload with AES256.

* When data and hashes are inserted, it takes a little bit of time to complete the commit. When passing the temporary TaskId value to the logware.getHashInsertResults() and logware.getDataInsertResults() methods, it is recommended to wait at least 1 second prior to execution. It tales the API about 1 second to generate a TransactionId from the TaskId. The TransactionId is permanent and should be saved, but the TaskId is temporary and can be purged.

* Manual inspection of block creation and the included TransactionId dataset can be viewed at https://explorer.logware.io/. When the data becomes visible here, the data has been written to the blockchain and can be considered permanent after 10 confirmation.

* Within your application, you can VERY quickly grab your data with this URL, https://chaindata.logware.io/tx/eb23d9dd26809b280a631e9a02cfe349916c3a5d0648d59e5721e5ac769944ca. Just replace the TransactionId value with the respective TransactionId you are searching for. 

## Installation
`npm install logwareio`

## Dependencies
* `request` - https://www.npmjs.com/package/request (I know it's deprecated but it works fine and I don't have a better alternative)

## Config
* `username` - Your Logware API Username
* `password` - Your Logware API Password
* `environment` (optional) - Accepted values are `test` or `prod`.  Defaults to `test`
* `apiUrl` (optional) - You can specify a custom api URL otherwise it defaults to `https://api.logware.io/api`
* `authToken` (optional) - If you have saved your active auth token somewhere you can specify it and the client won't try to authenticate again

## Usage
```
const Logware = require('logwareio');
const logware = new Logware({
    username: "myusername",
    password: "mypassword"
});
```

## Methods
### Insert Hash
```
logware.insertHash('10151127188c66142345eafd357f46f233d094e570c1f3b8772a064d4ff007fc', function(err, res) {
    // handle the response
}
```
#### Response
```
 {
  body: 'bb5175cd-9c8a-4f2f-9547-d56b392dab08',
  location: 'http://api.logware.io/api/Hash/prod/bb5175cd-9c8a-4f2f-9547-d56b392dab08',
  status: 201
}
```

### Get Hash Insert Results
```
logware.getHashInsertResults( '2b1ab37d-1924-414e-ac3c-dcdf845f576e', function(err, res) {
    // handle response
})
```
#### Response
```{
  body: {
    LTaskId: '2b1ab37d-1924-414e-ac3c-dcdf845f576e',
    ReponseCode: 200,
    Content: [
      'b11d4fa1b026dec49c9e016d8d9a08424d3c6d353937f2759cd548f6c5876ae2::b32c7369dd5093963cfe185d4a3df62b6f88302f06fccdfcd645edcb9a183b18'
    ]
  },
  status: 200
}
```

### Insert Data
```
logware.insertData('this is a test of some data to the blockchain', function(err, res) {
    // handle response
})
```
#### Reponse
```
 {
    body: 'a6eaa4df-fa00-4f2e-9ff7-dd523211a195',
    location: 'http://api.logware.io/api/Data/prod/a6eaa4df-fa00-4f2e-9ff7-dd523211a195',
    status: 201
 }
```
### Get Data Insert Results
```
logware.getDataInsertResults('a6eaa4df-fa00-4f2e-9ff7-dd523211a195', function(err, res) {
    // handle response
})
```

#### Response
```
{
  body: {
    LTaskId: 'a6eaa4df-fa00-4f2e-9ff7-dd523211a195',
    ReponseCode: 200,
    Content: [
      '4c09feeb5d29d5b0c4f2d6dc9c419e97e826f8fa2975ab5dbd8470d6c83d61f6'
    ]
  },
  status: 200
}
```

### Get Data
```
logware.getData('4c09feeb5d29d5b0c4f2d6dc9c419e97e826f8fa2975ab5dbd8470d6c83d61f6', function(err, res) {
    // handle response
})
```
#### Response
You'll notice a redundant key here called "data", this is on purpose.  I wanted to make it simple for you to grab your data from the 
object without having to care about anything else.  So you can basically look at `res.data` to get back  the data
that you originally wrote to the blockchain and ignore the `body` key.  I left the `body` key in there in case
someone wanted the full details of the block as well.
```
{
  data: 'this is a test of some data to the blockchain',
  body: {
    txid: '4c09feeb5d29d5b0c4f2d6dc9c419e97e826f8fa2975ab5dbd8470d6c83d61f6',
    blockheight: 2968964,
    confirmations: 2,
    blockhash: '10151127188c66142345eafd357f46f233d094e570c1f3b8772a064d4ff007fc',
    hash: '4c09feeb5d29d5b0c4f2d6dc9c419e97e826f8fa2975ab5dbd8470d6c83d61f6',
    pkdata: 'this is a test of some data to the blockchain',
    opcodedata: '',
    totalin: 1489.580774,
    totalout: 1489.579774,
    inputs: [
        {
            previndex: 82,
            address: 'KQPLvQ4DtMSjRWuCCSMnJS6uaSZWn2PJAZ',
            amount: 1489.580774,
            prevout: '4eed4895ef735c45b9b29a85d9dc7f2766d55e0fc2e5ca57aa57110ce690c389'
        }
    outputs: [ 
     {
            index: 0,
            address: 'KNRx3X3BUCzgaLs7QfWkBJYXBHh7SDx4F7',
            amount: 0.001,
            redeemedin: null
        },
        {
            index: 1,
            address: 'KQPLvQ4DtMSjRWuCCSMnJS6uaSZWn2PJAZ',
            amount: 1489.578774,
            redeemedin: null
        }
     ],
    _id: '4c09feeb5d29d5b0c4f2d6dc9c419e97e826f8fa2975ab5dbd8470d6c83d61f6'
  },
  status: 200
}
```
