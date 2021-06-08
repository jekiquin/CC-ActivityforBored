const url = 'http://www.boredapi.com/api/activity';
const typeSelectList = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];
const descriptionList = [
    'Type of activity',
    'Number of participants that this activity could involve',
    'A factor describing how possible an event is to do with zero being most accessible'
];

//DOM
const body = document.body;
const typeSelect = document.getElementById('type-select');
const participantsSelect = document.getElementById('participants-select');
const accessibilitySelect = document.getElementById('accessibility-select');
const description = document.getElementById('description');
const submitQuery = document.getElementById('submit');
const randomQuery = document.getElementById('random');
const resultDisplay = document.getElementById('result');
const activityForm = document.getElementById('activity-form');



async function getActivity(queryObj) {
    try {
        const response = await fetch(setFullQuerry(queryObj));
        const responseJson = await response.json();

        // display data here
        renderResult(responseJson);

    } catch (err) {
        console.log(err);
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

// parameters from form
function getParamatersFromForm() {
    // get data from DOM
    const formData = new FormData(activityForm);
    const formArray = [];
    for (let element of formData) {
        formArray.push(element);
    }
    return {
        type: formArray[0][1],
        participants: formArray[1][1],
        accessibility: formArray[2][1]
    }
}

function renderResult(jsonResult) {
    if (resultDisplay.firstChild) {
        resultDisplay.removeChild(resultDisplay.firstChild);
    }

    const result = document.createElement('p');
    var resultString;

    if (jsonResult.error) {
        resultString = 'No activity found with the specified parameters';
        resultDisplay.style.color = 'red';

    } else {
        resultDisplay.style.color = '';
        let {type, activity, participants, accessibility} = jsonResult;
        resultString = `
        Type: ${type[0].toUpperCase() + type.slice(1)}
        Activity: ${activity}
        No. of Participants: ${participants}
        Accessibility: ${accessibility}
        `;
    }
    result.innerText = resultString;
    resultDisplay.appendChild(result);
}

body.onload = () => {
    descriptionList.forEach((desc, idx) => {
        const tableRow = document.createElement('tr');
        const col1 = document.createElement('td');
        col1.innerText = `${idx + 1}.`;
        col1.style.padding = '0 1em';
        col1.style.verticalAlign = 'top';
        const col2 = document.createElement('td');
        col2.innerText = desc;
        col2.style.padding = '0 1em';
        tableRow.append(col1,col2);
        description.appendChild(tableRow);
    })
    typeSelectList.forEach(activity => {
        var option = document.createElement('option');
        option.value = activity;
        option.innerText = activity[0].toUpperCase() + activity.slice(1);
        typeSelect.appendChild(option)
    })
}

randomQuery.onclick = (e) => {
    e.preventDefault();
    getActivity({
        type: '',
        participants: '',
        accessibility: '',
    });
}

submitQuery.onclick = (e) => {
    e.preventDefault();
    const formObj = getParamatersFromForm();
    getActivity(formObj);
}

/*
For firefox bug. Not displaying non-digit characters
and negative.
*/
participantsSelect.addEventListener('keypress', e => {
    const inputValue = participantsSelect.value;
    const key = e.key;
    if (!key.match(/[0-9]/)) {
        e.preventDefault();
    }
});

accessibilitySelect.addEventListener('keypress', e => {
    const inputValue = accessibilitySelect.value;
    const minValue = accessibilitySelect.min;
    const maxValue = accessibilitySelect.max;
    const key = e.key;
    if (!key.match(/[0-9.]/)) {
        e.preventDefault();
    }
    if (key==='.' && inputValue.includes('.')) {
        e.preventDefault();
    }
});




