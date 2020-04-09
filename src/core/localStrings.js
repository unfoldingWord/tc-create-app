// 
// Translate strings into different languages 
// Then use localString(id) to return the language specific string to use
//
const strings = {
    en:{
        OpenSourceText:"Open Source Text",
        CompareSource:"Compare Source",
        OpenTargetText:"Open Target Text",
        CompareTarget:"Compare Target",
        missing:"Tooltip is missing"
    },
    el: {
        OpenSourceText:"Κείμενο ανοιχτού κώδικα",
        CompareSource:"Σύγκριση πηγής",
        OpenTargetText:"Άνοιγμα κειμένου στόχου",
        CompareTarget:"Συγκρίνετε Target",
        missing:"λείπει το εργαλείο"
    }
};

export const localString = (id) => {
    let lang = navigator.language.split(/-|_/)[0];
    if ( lang === undefined ) {
        lang = 'en';
    }
    let lstring = strings[lang][id];
    if ( lstring === undefined ) {
        return strings[lang]['missing']
    }
    return lstring;
};
