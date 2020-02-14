const DisplayModule = (() => {
    // structure
        eventsList = document.querySelector('.patient_events');

    // globals
    let ID, addArr, remArr, wrapper, stretch, newHeight;
    ID = 1;
    wrapper = 30;
    stretch = 44;

    // function utils
    const reassignButtons = function(IDmove) {
        IDmove === true ? ID++ : ID--;

        lastAdd = document.querySelector('.input_add_event');
        lastRem = document.querySelector('.input_remove_event');

        lastAdd.addEventListener('click', DisplayModule.addEvent);
        lastRem.addEventListener('click',  DisplayModule.removeEvent);
    }

    return {
        test: () => {
            return true;
        },
        addEvent: () => {
            if(ID > 10) { return; }

        // add new event field
            let HTML, newHTML, previousID;
            wrapper = 20;
            stretch = 38;
            
            HTML = '<li class="patien_row" id="row_ID"><input type="text" class="input_event" id="event-ID" placeholder="event-ID"><input type="button" class="input_add_event" id="event-btnAdd-ID" value="+"><input type="button" class="input_remove_event" id="event-btnRem-ID" value="-"></li>';
            newHTML = HTML.replace(/ID/g, ID);
            
            eventsList.insertAdjacentHTML('beforeend', newHTML);

            // remove previous minus event btn & remove previous plus event btn 
            
            if(ID != 1) {
            document.getElementById('event-btnAdd-' + (ID - 1)).parentNode.removeChild(document.getElementById('event-btnAdd-' + (ID - 1)));
            document.getElementById('event-btnRem-' + (ID - 1)).parentNode.removeChild(document.getElementById('event-btnRem-' + (ID - 1)));
            }

            // stretch the list wrapper
            newHeight = wrapper + (stretch * ID);
            document.querySelector('.patient_events').style.height = newHeight + "px";
            document.querySelector('.patient_events').style.transition = "0.1s ease";

            reassignButtons(true);           
        },
        removeEvent: () => {
        let ID, row, buttons;

        ID = lastRem.id.split('-')[2];
        if(ID == 1) { return; }

        row = document.getElementById('row_' + ID);
        buttons = '<input type="button" class="input_add_event" id="event-btnAdd-ID" value="+"><input type="button" class="input_remove_event" id="event-btnRem-ID" value="-">';

        // delete row
        row.parentNode.removeChild(row);

        // re-create the add event button of the previous row
        buttons = buttons.replace(/ID/g, ID - 1);
        
        document.getElementById('event-' + (ID - 1)).insertAdjacentHTML('afterend', buttons);

        // stretch (stringi) the list wrapper
        newHeight = newHeight - stretch;
        document.querySelector('.patient_events').style.height = newHeight + "px";
        document.querySelector('.patient_events').style.transition = "0.3s 0.1s ease";

        reassignButtons(false);
        },
        addPatientToList: (obj) => {
            let ill, HTML, newHTML;
            ill = "patient_row"

            HTML = '<li class="%ill%" id="patient-%num%"><div class="patient_number">#%num%</div><div class="patient_bio">%lastname%, %firstname%</div><div class="patient_events">%events%</div><div class="patient_delete"><input type="button" class="patient_delete_btn" id="patient_delete_%num%" value="X"></div></li>';

        obj.disease == false ? null : ill += " disease";
        newHTML = HTML.replace('%ill%', ill);
        newHTML = newHTML.replace(/%num%/g, obj.num);
        newHTML = newHTML.replace('%lastname%', obj.lastName);
        newHTML = newHTML.replace('%firstname%', obj.firstName);
        newHTML = newHTML.replace('%events%', obj.eventArr.join(', '));

        document.querySelector('.list_show').insertAdjacentHTML('beforeend', newHTML);
        },
        resertForm: (obj) => {
            document.querySelector('.patient_label').textContent = "Patient #" + (obj.num + 1);
        },
        updateList: (crowd) => {
            console.log(crowd);
            for(let i = 0; i < crowd.length; i++) {
                DisplayModule.addPatientToList(crowd[i]);
            }
        }
    }
})();



const LogicModule = (() => {
    let firstName, lastName, eventArr, disease, patientObj, journal, num, randomArr, howManyEvents;
    
    eventArr = [];
    journal = [];
    num = 1;

    randomArr = ['dog', 'cat', 'apple', 'sun', 'breeze', 'clay', 'sea', 'shell', 'bread', 'dirt', 'grass', 'wine', 'beer']

    const callRandomNumber = (min, max) => {
        if(min == 0 && max == 1) { return; }
        if(max - min == 1) { return; }
        return Math.floor(Math.random() * (max - min - 1) + 1);
    }

    const randomBio = () => {
        let firstArr, lastArr;
        firstArr = ['Antonio', 'Leo', 'Luca', 'Marco', 'Giuseppe', 'Francesco', 'Carlo', 'Mattia', 'Matteo', 'Davide', 'Damiano', 'Gabriele', 'Fabrizio'];
        lastArr = ['Del Latte', 'Di Muro', 'Zingarelli', 'Papagna', 'Di Nunno', 'Rosa', 'Quinto', 'Cancelli', 'Sorrenti', 'Cavalli', 'Tagliapietre', 'Del Vescovo', 'Trancoso'];

        return {
            first: firstArr[callRandomNumber(1, firstArr.length)],
            last: lastArr[callRandomNumber(1, lastArr.length)]
        }
    }

    const randomPatient = virality => {
        
        // from whic id I start counting? from num
        let bio, randomObj, risk, ill, randomEvents;
        randomEvents = [];

        bio = randomBio();
        risk = callRandomNumber(1, 100);
        if (risk > virality) {
            ill = false;
        } else {
            ill = true;
        }

    howManyEvents = callRandomNumber(1, 7);
    for(let i = 0; i < howManyEvents; i++) {
        let whichOne = callRandomNumber(1, randomArr.length);
        randomEvents.push(randomArr[whichOne]);
    }

        randomObj = {
                num: num,
                firstName: bio.first,
                lastName: bio.last,
                eventArr: randomEvents,
                disease: ill
        }

        num++;

        return randomObj;
    }

    return {
        test: () => {
            return true;
        },
        getInput: () => {
            // reset eventArr from previous usage
            eventArr = [];
            
            // get fields input, push to data-storage, than return it as an object
            firstName = document.querySelector('.input_firstname').value;
            lastName = document.querySelector('.input_lastname').value;
            disease = document.querySelector('.input_disease').checked;

            document.querySelectorAll('.input_event').forEach((record) => {
            eventArr.push(record.value);
            });
            
            // push to data-storage
            patientObj = {num, firstName, lastName, eventArr, disease};
            journal.push(patientObj);

            // increment id
            num++;

            // return it as object
            return patientObj;
        },
        generateRandom: (quantity, virality) => {
            let crowdArr;
            
            crowdArr = [];

            for(let i = 0; i < quantity; i++) {
                crowdArr.push(randomPatient(virality));
            }
            return crowdArr;
        },
        addCrowd: (crowd) => {
            for(let i = 0; i < crowd.length; i++) {
                journal.push(crowd[i]);
            }
        }
    }
})();



const Controll = ((display, logic) => {
    let firstNameInput, lastNameInput, eventInput, diseaseInput, journal, eventsList, ID;
    journal = [];
    ID = 2; // addPatientEvent
    
    const setupEventListener = () => {
        // button - addEntry
            // submit
        document.querySelector('.input_submit').addEventListener('click', getInput);

            // add new event
        document.querySelectorAll('.input_add_event').forEach((button) => {
            button.addEventListener('click', display.addEvent);
        });

            // keyboard actions
        document.addEventListener('keydown', event => {
            let k = event.keyCode;
            if(k == 187) {
                display.addEvent();
            } else if (k == 189) {
                display.removeEvent();
            }
        });

            // random Handler
            document.getElementById('randomHandler').addEventListener('click', insertRandomCrowd);

        //ogni volta che crei un nuovo event spostare il focus nel nuovo event

        
    }

    const insertRandomCrowd = () => {
        let quantity, virality, crowd, journalUpdated;

        // ask how many
        quantity = prompt("How many random patients do you want to inject?", 42);
        virality = prompt("How high is the frequency of illness", 50);

        // get back an array made up of objects
        crowd = logic.generateRandom(quantity, virality);

        // per each index of crowd array, update data in logic and show on UI
        logic.addCrowd(crowd);
        display.updateList(crowd);
        display.resertForm(crowd[crowd.length - 1]);
    }

    const getInput = function() {
        // ask LogicModule => get, push, return fieldsInput as an object, patientInput
        let patientObj = logic.getInput();

        // ask DisplayModule => reset input fields
        display.resertForm(patientObj);

        // ask DisplayModule => update the list of patients
        display.addPatientToList(patientObj);
    }


    return {
        test: () => {
            let d, l;
            d = display.test();
            l = logic.test();
            console.log("Display module operative: " + d + "\nLogic module operative: " + l);
        },
        init: () => {
            console.log('Application started successfully.');
            setupEventListener();
            display.addEvent();
        }
    }
})(DisplayModule, LogicModule);

Controll.init();

