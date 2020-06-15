# Facebook Bot from google app script

This repo intends to serve as library to ease in creation of fbChat Bot using Google App Script.

# Usage 

ProjectId:Mv5AiDrYjIUDuX4K_XPiByj6333tZbdFa

Go to Resources > Libraries and add the above library using the above project id.

# Sample code to create echo bot
```js
var BOT = new Bot(ACCESS_TOKEN,VERIFY_TOKEN,sid);
function doGet(request) {
    //var BOT = Bot(ACCESS_TOKEN,VERIFY_TOKEN,sid);
    return BOT.verify(request);
}

function doPost(request) {
    //var BOT = Bot(ACCESS_TOKEN,VERIFY_TOKEN,sid);
    Logger.log("received "+JSON.stringify(request));
    return BOT.response(request);
}
```
