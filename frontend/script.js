
let selectedTimeZone = document.getElementById("timezone").value;


function generateSchedule(timeGridID, dateHeaderId) {
    let timeGrid = document.getElementById(timeGridID);

    let availability = {};

    let isMouseDown = false;

    // Modify the toggleAvailability function (or wherever you handle the cell click event)
    function toggleAvailability(event) {
        const cell = event.target;
        if (cell.className === 'available') {
            cell.className = 'unavailable';
            updateState(cell.id, 'unavailable');
        } else {
            cell.className = 'available';
            updateState(cell.id, 'available');
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

// Function to fetch and set the saved state from the server
async function fetchAndSetState() {
    try {
        const response = await fetch('https://call-your-gf.onrender.com/api/state');
        const data = await response.json();

        // Ensure there's data and get the first object in the array
        if (data.length > 0) {
            const state = data[0];
            console.log("Fetched state:", state);  // Log the fetched state

            for (const cellId in state) {
                const cell = document.getElementById(cellId);
                if (cell) {
                    console.log("Updating cell:", cellId, "to", state[cellId]);  // Log each cell update
                    cell.className = state[cellId];
                } else {
                    console.log("Cell not found:", cellId);  // Log if a cell isn't found
                }
            }
        } else {
            console.log("No state data retrieved.");
        }
    } catch (error) {
        console.error('Error fetching state:', error);
    }
}


// Function to update the state on the server
async function updateState(cellId, newState) {
    try {
        await fetch('https://call-your-gf.onrender.com/api/state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [cellId]: newState })
        });
    } catch (error) {
        console.error('Error updating state:', error);
    }
}

generateSchedule("my_timeGrid", "my_dateHeaders")
generateSchedule("gf_timeGrid", "gf_dateHeaders")
fetchAndSetState()
