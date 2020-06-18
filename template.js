function Template(type="generic")
{
    this.template_type = type;
    this.elements = [];
}

Template.prototype.addElement = function(template)
{
    this.elements.push(template);
}

function Element(title,subtitle,image_url)
{
    this.title = title;
    this.image_url = image_url;
    this.subtitle = subtitle;   
    return this;
}

Element.prototype.addButton = function(buttons)
{
    this.buttons = buttons.buttons;
}

Element.prototype.addDefaultActions = function(action_type,action)
{
    this.default_action = {
        "type":action_type
    };
    if (action_type == "web_url")
    {
        this.default_action.url = action;
    }
    else if (action_type == "payload")
    {
        this.default_action.payload = action;
    };
}


