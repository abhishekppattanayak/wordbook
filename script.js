document.querySelector('header').textContent = `${new Date().toUTCString()}`.slice(0,16);
document.querySelector('footer > span').textContent = `Copyright © ${new Date().getFullYear()} `;
const map = new Map();
const dictionary = document.querySelector('ul');

const getJSON = word => {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
                throw new Error();
        })
        .then(data => {
            console.log(word, data)
            if("word" in data[0]){
                console.log(1)
                let dataNeeded = data[0]['meanings'][0];
                console.log(JSON.stringify(dataNeeded))
                console.log(2)
                localStorage.setItem( word , JSON.stringify(dataNeeded) );
                return dataNeeded;
            }
        })
        .catch(error => {
            return false;
        });
};

const flag = () => {
    let f = true;
    Array.from(document.querySelectorAll('main > ol > li > input')).forEach(element => f = f && element.checkValidity());
    return f;
}

const notepad = document.querySelector('ol');
const button = document.querySelector('#button');

for (let i = 0; i < 10; ++i) {
    let line = document.createElement('li');
    let word = document.createElement('input');
    
    word.addEventListener('input', () => {

        if (word.value in localStorage) {
            word.setCustomValidity('This word already exists.');
        } else {
            word.setCustomValidity('');
        }
        
        button.disabled = !flag();
    });
    
    line.appendChild(word);
    notepad.appendChild(line);
}


button.addEventListener('click', () => {
    if(!button.disabled){
        Array.from(document.querySelectorAll('input')).forEach(element => {
            if(element.value != ''){
                getJSON(element.value);
            }
        });
    }
});


for(let i=0;  i<localStorage.length; ++i){
    let listItem = document.createElement('li');
    listItem.textContent = localStorage.key(i);
    let data = localStorage.getItem(localStorage.key(i))
    data = JSON.parse(data)
    let partOfSpeech = data["partOfSpeech"];
    let definitions = data["definitions"];
    listItem.addEventListener('click', ()=>{
        document.querySelector('aside > ol').innerHTML = '';
        document.querySelector('aside > h1').textContent = localStorage.key(i)
        document.querySelector('aside > span').textContent = partOfSpeech;
        definitions.forEach(json => {
            let def = document.createElement('li');
            def.textContent = json["definition"];
            document.querySelector('aside > ol').appendChild(def);
        })
    })
    dictionary.appendChild(listItem);
}