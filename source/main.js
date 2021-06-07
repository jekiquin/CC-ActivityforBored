const url = 'http://www.boredapi.com/api/activity';

async function getActivity() {
    try {
        const queryObj = getParametersFromForm();
        const response = await fetch(setFullQuerry(queryObj));
        const responseJson = await response.json();
        if (responseJson.error) {
            throw new Error(responseJson.error);
        }
        // display data here

    } catch (err) {
        console.log(err);
    }
}


// parameters from form
function getParamatersFromForm() {
    // get data from DOM
    return {
        type,
        participants,
        accessibility
    }
}

function setFullQuerry(queryObj) {
    var stringToPass = '';
    var firstParam = true;
    var queryOperator = '?';
    if (Object.entries(queryObj).every(entry => entry[1] === '')) {
        return url + '/';
    }
    for (key in queryObj) {
        if (firstParam) {
            firstParam = false;
        } else {
            queryOperator = '&';
        }
        if (queryObj[key] !== '') {
            stringToPass += queryOperator + key + '=' + queryObj[key];
        }
        
    }
    return url + stringToPass;
}




