
module ObjectStyler {
    var initializer = "!!";
    var separater = ",,";
    function evaluate(funcName : string, args : string[], text : string) : string {
        switch(funcName) {
            case "link" :
                var href = args[0];
                if(href === undefined) href = text;

                return '<a href="'+href+'">'+text+'</a>';

                break;
            default :
                return "ERROR ("+ funcName +") string function does not exist"
                break;
        }
    }
    export function parseStringValue(strValue : string) : string {
        // !!func,, [arg,,..],, text

        if(strValue.substring(0,2) !== initializer) {
            return strValue;
        }

        // split and clean
        var callList = strValue.substring(2).split(separater);
        for(var i = 0 ; i < callList.length ; i++){
            callList[i] = callList[i].trim();
        }

        // evaluate
        var funcName = callList[0];
        var args = callList.slice(1,callList.length-1);
        var text = callList[callList.length-1];

        return evaluate(funcName, args, text);
    }
}
