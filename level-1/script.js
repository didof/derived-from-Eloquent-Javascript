let journal, innerHTML, list, ID, randomFirst, randomLast, name;

journal = [];
list = document.querySelector('.patient_list');
ID = 0;
name = {
    firstname: ['Frank', 'Jacque', 'Mary', 'Antonio', 'Carl', 'Chicco', 'Giuseppe', 'Marco', 'Cesare', 'Enea'],
    lastname: ['Bellavista', 'Acquaviva', 'Carlucci', 'Settemani', 'Quinto', 'Caio', 'Malavoglia']
}



document.querySelector('.addEntryHandler').addEventListener('click', () => {
    let eventValue = document.querySelector('.event').value;
    let diseaseValue = document.querySelector('.disease').value;
    let quantity = document.querySelector('.patients_quantity').value;
    
    addEntry(eventValue, diseaseValue, quantity);
});

function addEntry(event, disease, quantity) {
    while(quantity > 0){
    let newHTML;

    innerHTML = "<li><span id='%id%'>%name%</span><span id='event'>%event%</span><span id='disease'>%disease%</span></li>";

    journal.push({
        event: event,
        disease: disease
    });

    ID++;
    randomFirst = Math.floor((Math.random() * name.firstname.length - 1) + 1);
    randomLast = Math.floor((Math.random() * name.lastname.length - 1) + 1);
    patientName = name.firstname[randomFirst] + " " + name.lastname[randomLast];

    newHTML = innerHTML.replace('%event%', event);
    newHTML = newHTML.replace('%id%', ID);
    newHTML = newHTML.replace('%disease%', disease);
    newHTML = newHTML.replace('%name%', patientName);

    list.insertAdjacentHTML('beforeend', newHTML);

    quantity--;
    }
}

document.querySelector('.showJournal').addEventListener('click', () => {
    console.clear();
    console.table(journal);
});

document.querySelector('.calculateCorrelation').addEventListener('click', function() {
    let table, dividend, divisor, phi, string;
    
    table = [
        [0, 0],     // no-smoke, no-tumor | no-smoke, tumor
        [0, 0]      // smoke, no-tumor | smoke, tumor
    ]

    for(let i = 0; i < journal.length; i++) {
        console.table(journal[i]);
        if(journal[i].event == "false" && journal[i].disease == "false") {
            table[0][0] += 1;
        } else if(journal[i].event == "false" && journal[i].disease == "true") {
            table[0][1] += 1;
        } else if(journal[i].event == "true" && journal[i].disease == "false") {
            table[1][0] += 1;
        } else if(journal[i].event == "true" && journal[i].disease == "true") {
            table[1][1] += 1;
        }
    }
    console.clear();
    console.table(table);
    
    dividend = (table[1][1] * table[0][0]) - (table[1][0] * table[0][1]);
    divisor = Math.sqrt((table[1][0] + table[1][1]) *
                        (table[0][0] + table[0][1]) *
                        (table[0][1] + table[1][1]) *
                        (table[0][0] + table[1][0])
                        );
    phi = dividend / divisor;

    if(phi >= -1 && phi < 0) {
        string = "inverse correlation";
    } else if(phi === 0) {
        string = "no correlation";
    } else if(phi > 0 && phi <= 1) {
        string = "direct correlation";
    }

    document.getElementById('output').textContent = "Your date has shown that the correlation coefficient between the event and the disease is: " + phi + " - " + string;
})
