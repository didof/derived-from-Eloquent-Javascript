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
        }
    }
})();



const LogicModule = (() => {
    let firstName, lastName, eventArr, disease, patientObj, journal;
    
    eventArr = [];
    journal = [];

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
            disease = document.querySelector('.input_disease').value;

            document.querySelectorAll('.input_event').forEach((record) => {
            eventArr.push(record.value);
            });
            
            // push to data-storage
            patientObj = {firstName, lastName, eventArr, disease};
            journal.push(patientObj);

            // return it as object
            return journal;
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

        //ogni volta che crei un nuovo event spostare il focus nel nuovo event

        
    }

    const getInput = function() {
        // ask LogicModule => get, push, return fieldsInput as an object, patientInput
        let patientsJournal = logic.getInput();
        console.log(patientsJournal);

        // ask DisplayModule => reset input fields
        // display.resertForm();

        // ask DisplayModule => update the list of patients
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

