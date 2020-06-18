function Buttons() {
    this.buttons = [];
}

Buttons.prototype.addUrlButton = function(title,url)
{
    let button = {
        "type":"web_url",
        "url":url,
        "title":title
    };
    this.buttons.push(button);
}

Buttons.prototype.addPostbackButton = function(title,payload)
{
    let button = {
        "type":"postback",
        "payload":payload,
        "title":title
    };
    this.buttons.push(button);
}

Buttons.prototype.addCallButton = function(title,payload)
{
    let button = {
        "type":"phone_number",
        "payload":payload,
        "title":title
    };
    this.buttons.push(button);
}

Buttons.prototype.addLogInButton = function(url)
{
    let button = {
        "type": "account_link",
        "url": url
    };
    this.buttons.push(button);
}

Buttons.prototype.addLogOutButton = function()
{
    let button = {
        "type": "account_unlink"
    };
    this.buttons.push(button);
}
