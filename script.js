

let timeGrid = document.getElementById("timeGrid");

let availability = {};

function toggleAvailability(event){
    let cell = event.target;

    if(cell.tagName === "TD" && cell.id){
        if (cell.className==="unavailable"){
            cell.className = "available";
            availability[cell.id] = "available";
        }
        else{
            cell.className = "unavailable";
            availability[cell.id] = "unavailable";
        }
    }
}

let tableHeader = document.querySelector("#dateHeaders");

let timeHeader = document.createElement("th");
timeHeader.textContent = "Time";
timeHeader.setAttribute("colspan", "2");

// Add the new th element to the table header
tableHeader.appendChild(timeHeader);

let today = new Date();

// Set the day to Monday (Monday is 1 in JavaScript's getDay() function, where Sunday is 0)
let dayOfWeek = 1;

// Subtract the current day of the week from 1 to get the number of days to go back to the previous Monday
let daysUntilLastMonday = (today.getDay() + 7 - dayOfWeek) % 7;

// Get the date of the last Monday
let lastMonday = new Date(today);
lastMonday.setDate(today.getDate() - daysUntilLastMonday);

for (let i = 0; i < 7; i++){
    let date = new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate() + i);

    let dateString = date.toLocaleDateString("en-US", {weekday: 'short', month: '2-digit', day: '2-digit'});

    let dateHeader = document.createElement("th");
    dateHeader.textContent = dateString;

    tableHeader.appendChild(dateHeader);
}



for (let i = 0; i < 24; i++){
    let row = document.createElement("tr");

    let hourCell = document.createElement("td");
    hourCell.textContent = `${i}:00 - ${i+1}:00`;
    hourCell.setAttribute("colspan","2");
    row.appendChild(hourCell);

    for (let j = 0; j < 7; j++){
        let cell = document.createElement("td");
        cell.id = `day${j}hour${i}`;
        cell.className = "unavailable";
        cell.addEventListener("click", toggleAvailability);
        row.appendChild(cell);

        availability[cell.id] = "unavailable";
    }

    timeGrid.appendChild(row);
}

