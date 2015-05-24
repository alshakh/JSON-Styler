/// <reference path="stringFunctions.ts"/>

module ObjectStyler {
    /**
     * Style type
     * 	name : name of style
     * 	className : class names to add to styled things
     *
     * @type {Object}
     */
    export type Style = {name:string, className: string};
    export type HTML = string;
    export interface EssentialStyles {
        endLine : string,
        punctuation : string,
        blockIndent : string
    }
    /**
     * style discripton to discribe how to style object
     * 		it is an object with the same keys as object to discribe the object keys
     *   styleDiscription {
     *   	key : StyleActivation,
     *   	otherKey : StyleActivation}
     */
    export type StyleDiscription = Object;
    export interface StyleActivation {
        k?:string[] | string,
        v?:string[] | string | StyleDiscription
    }

    export class Styler {

        styles: Style[];
        punctuationStyleName : string;
        endlStyleName : string;
        blockIndentStyleName:string;

        quoteSymbol:string;
        constructor(essentialStyles : EssentialStyles, styles : Style[], quote : string = "'") {
            this.styles = styles;

            this.punctuationStyleName = essentialStyles.punctuation;
            this.endlStyleName = essentialStyles.endLine;
            this.blockIndentStyleName = essentialStyles.blockIndent;

            this.quoteSymbol = quote;
        }

        style(object: Object, styleDisc: StyleDiscription) : HTML {
            return this.styleObject(object,styleDisc);
        }

        private styleValue(value : string|boolean|number, activatedSyls: string[]) {
            var html = "";
            if(typeof value === "string") {
                var quote = this.styleSpan(this.quoteSymbol, [this.punctuationStyleName] );

                html += this.styleSpan(quote + parseStringValue(value) + quote,activatedSyls);

            } else {
                html += this.styleSpan(value.toString(),activatedSyls);
            }
            return html;
        }
        private styleArray(array: any[], activaSyls: string[] | StyleDiscription) : HTML {
            var valSyl = (activaSyls instanceof Array? activaSyls : []);
            var objectSyl = (typeof activaSyls === 'object'? activaSyls: {});


            var htmlResult = this.styleSpan("[", [this.punctuationStyleName]);
            for(var i = 0 ; i < array.length ; i++) {
                if(i !== 0) {
                    htmlResult += this.styleSpan(", ", [this.punctuationStyleName]);
                }
                if(array[i] instanceof Array) {
                    htmlResult += this.styleArray(array[i], activaSyls);
                } else if (typeof array[i] === "object" ) {
                    htmlResult += this.styleObject(array[i], objectSyl);
                } else {
                    htmlResult += this.styleValue(array[i], valSyl);
                }
            }
            htmlResult += this.styleSpan("]", [this.punctuationStyleName]);
            return htmlResult;
        }
        private styleObject(object:Object, styleDisc:StyleDiscription) : HTML {
            var html = "";
            // {
            html += this.styleSpan("{", [this.punctuationStyleName]);
            //
            html += this.indentDiv(this.styleObjectHelper(object, styleDisc))
            // }
            html += this.styleSpan("}", [this.punctuationStyleName]);

            return html;
        }
        private styleObjectHelper(object: Object, styleDisc:StyleDiscription) : HTML{
            function getKeyActiveStyles(styleActivation: StyleActivation) : string[] {
                var syls : string[];

                if(styleActivation && styleActivation.k) {
                    var kSyl = styleActivation.k;
                    if(typeof kSyl === 'string') {
                        syls = [kSyl];
                    } else if(kSyl instanceof Array) {
                        syls = kSyl;
                    }
                } else {
                    syls = [];
                }
                return syls;
            }
            function getValueActiveStyles(styleActivation: StyleActivation,
                    defaultReturn : string[] | StyleDiscription)  : string[] | StyleDiscription {

                if(styleActivation && styleActivation.v) {
                    if(typeof styleActivation.v === 'string') {
                        return [styleActivation.v]
                    } else  {
                        return styleActivation.v;
                    }
                } else {
                    return defaultReturn;
                }
            }

            var html = "";
            //
            for(var key in object) {
                if(object.hasOwnProperty(key)) {

                    // key
                    var keySyls = getKeyActiveStyles(styleDisc[key]);
                    html += this.styleSpan(key,keySyls);

                    // :
                    html += this.styleSpan(" : ",[this.punctuationStyleName]);

                    // value
                    if(object[key] instanceof Array) {

                        var syls = getValueActiveStyles(styleDisc[key],[]);
                        html += this.styleArray(object[key],syls);

                    } else if(typeof object[key] === "object") {

                        var objectSyl = getValueActiveStyles(styleDisc[key],{});
                        if(objectSyl instanceof Array) {
                            html += this.styleObject(object[key],{});
                        } else {
                            html += this.styleObject(object[key],objectSyl);
                        }

                    } else {

                        var valueSyl = getValueActiveStyles(styleDisc[key],[]);
                        if(valueSyl instanceof Array) {
                            html += this.styleValue(object[key], valueSyl);
                        }

                    }
                    // end comma

                    html += this.styleSpan(",",[this.punctuationStyleName, this.endlStyleName]);
                }
            }
            return html;
        }
        /////// HTML functions
        /**
        adds proper classes to spans
        styleByDefault : if a style is not in activatedStyles, style span by the defaultClassName for it
        */
        private styleSpan(content:HTML, activatedStyles:string[]) {
            var classString = "";

            for(var i = 0 ; i < this.styles.length ; i++) {
                var syl = this.styles[i];
                var isActivated = activatedStyles.some((v)=>{
                    return v ===  syl.name;
                });
                if(isActivated) {
                    classString += " " + syl.className;
                }
            }

            if(classString.trim().length ===0) {
                return '<span>' + content + '</span>';
            } else {
                return '<span class=\"' + classString.trim() + '">' + content + '</span>';
            }
        }
        private indentDiv(content: HTML) {
            var searchStyle = this.styles.filter((v) => v.name === this.blockIndentStyleName);
            if(searchStyle.length !== 0 ) {
                return '<div class="' + searchStyle[0].className + '">' + content + '</div>';
            } else {
                return '<div>' + content + '</div>';
            }


        }
    }
}
