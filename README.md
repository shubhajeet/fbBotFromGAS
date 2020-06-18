# Facebook Bot from google app script

This repo intends to serve as library to ease in creation of fbChat Bot using Google App Script.

# Usage 

ProjectId:Mv5AiDrYjIUDuX4K_XPiByj6333tZbdFa

Go to Resources > Libraries and add the above library using the above project id.

# Learn By Example
## Sample code to create echo bot
```js
var BOT = new fbBot.Bot(ACCESS_TOKEN,VERIFY_TOKEN);
function doGet(request) {
    return BOT.verify(request);
}

function doPost(request) {
    Logger.log("received "+JSON.stringify(request));
    BOT.addResponse( messageEvent =>
    {
    BOT.sendMessage(messageEvent.sender.id,new Message().addText("got text: " + messageEvent.message.text));
    },
    messageEvent =>
    {
      return true;
    }
    );
    return BOT.response(request);
}
```
## Create quick reply
```js
      let message = new fbBot.Message();
      message.addText("Hi, How may I help you?");
      Logger.log("Added Text "+JSON.stringify(message));
      message.createReply("Buy","BUY");
      Logger.log("Added First Reply "+JSON.stringify(message));
      message.createReply("Inquire","INQUIRE");
      Logger.log("Added Replies "+JSON.stringify(message));
      BOT.sendMessage(messageEvent.sender.id,message);
```

## Creating a Generic Template
```js
let message = new fbBot.Message();
let template = new fbBot.Template();
let buttons = new fbBot.Buttons();
buttons.addUrlButton("Website","https://maharjansujit.com.np");
buttons.addPostbackButton("Checkout","BUY checkout");
buttons.addCallButton("Contact","+977 9888888888");
template.addElement("Gas","subtitle","https://maharjansujit.com.np/logo.jpg","url","https://maharjansujit.com.np",buttons);
message.addTemplate(template);
```
