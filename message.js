function Message(){}
/*
 * @param this dictionary
 * @param payload
 */
Message.prototype.addTemplate = function(payload)
{
    this["attachment"] = {
        "type":"template",
        "payload":payload
    };
    return this;
}
/*
 * @param this dictionary
 * @param text string this to be send
 */
Message.prototype.addText = function(text)
{
    this.text = text;
    return this;
}

/*
 * @param title string
 * @param payload the return data that needs to be handled
 * @param image_url image to be displayed
 * @param type should be text/email/phone
 */
Message.prototype.createReply = function(title,payload,image_url=null,type="text")
{
    var data =  {
        "content_type": type,
        "title": title,
        "payload":payload
    };
    if (image_url)
    {
        data["image_url"] = image_url;
    }
    if (this["quick_replies"])
    {
        this.quick_replies.push(data);
    }
    else
    {
        this.quick_replies = [data];
    }
    return this;
}

