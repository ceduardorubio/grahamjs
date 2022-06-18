# Simple Asterisk Extension Creator
 - Add Sip Extension to Asterisk
 - Add Context to Asterisk
 - Get Sip Extension from Asterisk in JSON format


## Notes
the extraConfigs are an array of objects with the following properties:
- key: string
- value: string

Example : 
```javascript

let extension = "1001";
let username = "1001";
// ...
let extraConfigs = [
  {
    key: "allow",
    value: "gsm"
  },
  {
    key: "allow",
    value: "ulaw"
  }
]

let asterisk = AsteriskController();
let newSipExtensionText = asterisk.GetSipExtensionString((extension, username, secret, context, type, callerId, qualify, host, canReinvite, extraConfigs);
asterisk.AddNewSipExtension(newSipExtensionText,(error,asteriskOutput)=>{
    if(error){
      console.log(error);
    } else{
        console.log("Sip Extension added successfully");
    }
});

```
