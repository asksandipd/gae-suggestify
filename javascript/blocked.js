if (! info){
    var info = {};
}

if (! info.aaronland){
    info.aaronland = {};
}

if (! info.aaronland.geosuggestions){
    info.aaronland.geosuggestions = {};
}

info.aaronland.geosuggestions.Blocked = function(args){
    this.args = args;

    var api_args = {
        'host' : this.args['geosuggestions_apihost'],
        'enable_logging' : this.args['enable_logging']
    };

    this.api = new info.aaronland.geosuggestions.API(api_args);
};

info.aaronland.geosuggestions.Blocked.prototype.unblock = function(user_id, username){

    // @ symbols make jquery sad...
    var jquery_id = user_id.replace("@", "");

    var _doThisOnSuccess = function(rsp){

        var html = '<span class="unblock_user_ok">';
        html += escape(username) + ' has been unblocked!';
        html += '</span>';

        $("#blocked_" + jquery_id).html(html);

        setTimeout(function(){
                $("#blocked_" + jquery_id).hide();
        }, 10000);
    };

    var _doThisIfNot = function(rsp){

        if (! rsp){
            alert("Hrm. Something went wrong calling the API!");
            return;
        }

        var err = rsp.getElementsByTagName("error")[0];
        var msg = err.getAttribute("message");

        var html = '<span class="unblock_user_fail">';
        html += 'Hrm. Unblocking failed with the following error: "' + escape(msg) + '"';
        html += '</span>';

        $("#blocked_" + jquery_id).html(html);

        var s = $("#blocked_" + jquery_id);
        s.css("color", "red");
        s.html();
    };

    var meth_args = {
        'crumb' : this.args['unblock_crumb'],
        'user_id' : user_id,
    };

    this.api.api_call('unblock', meth_args, _doThisOnSuccess, _doThisIfNot);

    $("#blocked_" + jquery_id).html('<span class="whirclick">whir! click!!</span>');

};

// -*-java-*-