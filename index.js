const konamiCode = "injects3cret";
let enteredText = [];
let lastCharTime;

document.addEventListener('keydown', (event) => {
    const date = new Date();
    console.log(event);

    if (enteredText.length === 0){
        lastCharTime = date.getTime();
    }
    if (date.getTime() - lastCharTime > 5000 || event.key === 'Escape'){
        enteredText = [];
    }
    else {
        enteredText.push(event.key);
        lastCharTime = date.getTime();

        if (enteredText.length > konamiCode.length){
            enteredText.shift();
        }

        if (enteredText.join("") === konamiCode){
            const dataPromise = getData();
            dataPromise.then( (data) => {
                console.log(data);
                addElementsToDOM(data);
                setTimeout(removeElementsFromDOM, 15000);
                enteredText = [];
            })
        }
    }
});

function getData() {
    console.log('getting data');
    let endpoint = "https://api.github.com/repos/elixir-lang/elixir/issues";
    return fetch(endpoint)
        .then((result) => {
            return result.json()
        })
        .then((data) => {
            data.sort( (first, second) => first['created_at'] - second['created_at']);
            return data.slice(0,5);
        });
}

function addElementsToDOM(issues) {
    const elements = issues.map( (issue, index) => {
        return (
            `<div>
                <strong>Issue #${index + 1}</strong>
                <h3>${issue.title}</h3>
                Author: ${issue.user.login}
                <p></p>
            </div>
            `
        )
    });

    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', `<div id=issues></div>`);
    const issuesElement = document.querySelector('#issues');
    issuesElement.insertAdjacentHTML('beforeend', elements.join(''));
}

function removeElementsFromDOM() {
    const issuesElement = document.querySelector('#issues');
    issuesElement.remove();
}