
let selectedTimeZone = document.getElementById("timezone").value;


function generateSchedule(timeGridID, dateHeaderId) {
    let timeGrid = document.getElementById(timeGridID);

    let availability = {};

    let isMouseDown = false;

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
    

    let tableHeader = document.querySelector("#" + dateHeaderId);

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
        hourCell.classList.add("no-select");
        row.appendChild(hourCell);

        for (let j = 0; j < 7; j++){
            let cell = document.createElement("td");
            cell.id = `${timeGridID}day${j}hour${i}`;
            cell.className = "available";
            
            // When the mouse is pressed down, start toggling availability
            cell.addEventListener("mousedown", (event) => {
                isMouseDown = true;
                toggleAvailability(event);
            });
            
            // When the mouse is moved, if it is down, toggle availability
            cell.addEventListener("mouseover", (event) => {
                if (isMouseDown) {
                    toggleAvailability(event);
                }
            });
            
            // When the mouse is released, stop toggling availability
            cell.addEventListener("mouseup", () => {
                isMouseDown = false;
            });
    
            row.appendChild(cell);
    
            availability[cell.id] = "available";
        }

        timeGrid.appendChild(row);

    
    }
    document.addEventListener("mouseup",() =>{
        isMouseDown=false;
    })
}

generateSchedule("my_timeGrid", "my_dateHeaders")
generateSchedule("gf_timeGrid", "gf_dateHeaders")
