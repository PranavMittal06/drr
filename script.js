$(document).ready(function() {
    let excludedDates = []; // Array to store excluded dates
    
    function updateExcludedDates() {
        const excludedDatesInput = $("#excluded-dates");
        excludedDatesInput.val(excludedDates.join(", ")); // Display excluded dates in the input field
    }
    
    function calculateNumberOfDays(startDate, endDate) {
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
        const startTimestamp = startDate.getTime();
        const endTimestamp = endDate.getTime();
        
        // Calculate the number of days between the start and end dates, excluding excluded dates
        let numDays = 0;
        for (let currentTimestamp = startTimestamp; currentTimestamp <= endTimestamp; currentTimestamp += oneDay) {
            const currentDate = new Date(currentTimestamp);
            const stringDate = $.datepicker.formatDate('yy-mm-dd', currentDate);
            if (excludedDates.indexOf(stringDate) === -1) {
                numDays++;
            }
        }
        return numDays;
    }

    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        beforeShowDay: function(date) {
            // Function to highlight excluded dates
            const stringDate = $.datepicker.formatDate('yy-mm-dd', date);
            return [excludedDates.indexOf(stringDate) === -1];
        },
        onSelect: function(dateText, inst) {
            // Handle date selection and display Month and Year
            const startDate = $("#start-date").datepicker("getDate");
            const endDate = $("#end-date").datepicker("getDate");
          
            if (startDate && endDate) { 
                if(startDate > endDate){
                    alert("Please enter valid end date")
                }
                const month = startDate.getMonth() + 1;
                const year = startDate.getFullYear();
                $("#month").text(month);
                $("#year").text(year);
                const numDays = calculateNumberOfDays(startDate, endDate);
                $("#num-days").text(numDays);
            }
        }
    });

    // Apply the datepicker explicitly to the excluded dates input field
    $("#excluded-dates").datepicker({
        dateFormat: 'yy-mm-dd',
        beforeShowDay: function(date) {
            const stringDate = $.datepicker.formatDate('yy-mm-dd', date);
            return [excludedDates.indexOf(stringDate) === -1];
        },
        onSelect: function(dateText, inst) {
            // Handle the selection of excluded dates
            const startDate = $("#start-date").datepicker("getDate");
            const endDate = $("#end-date").datepicker("getDate");
            const selectedDate = new Date(dateText);
            
            if (startDate && endDate && (selectedDate < startDate || selectedDate > endDate)) {
                alert("Excluded date must be between Start Date and End Date.");
            } else {
                excludedDates.push(dateText);
            }
            updateExcludedDates();

            // Update the number of days
            const numDays = calculateNumberOfDays(startDate, endDate);
            $("#num-days").text(numDays);
        }
    });

   

    // Handle input for Number of Leads
    $("#lead-count").on('input', function() {
        const numLeads = parseInt($("#lead-count").val());
        const numDays = parseInt($("#num-days").text());
        if (!isNaN(numLeads) && !isNaN(numDays)) {
            const expectedCount = numLeads / numDays;
            $("#expected-lead-count").text(expectedCount.toFixed(2));
        } else {
            $("#expected-lead-count").text("");
        }
    });

    // Populate the table with data from localStorage
    function populateTableFromLocalStorage() {
        const storedData = JSON.parse(localStorage.getItem('myData')) || [];
        for (const data of storedData) {
            createNewRow(data);
        }
    }
const i=1;
    function createNewRow(data) {
        const newRow = $("<tr>");
        newRow.append("<td><button>Edit</button><button>Delete</button></td>");
        newRow.append(`<td>${i++}</td>`); // You can replace "N/A" with the relevant ID
        newRow.append(`<td>${data.startDate}</td>`);
        newRow.append(`<td>${data.endDate}</td>`);
        newRow.append(`<td>${$("#month").text()},${$("#year").text()}</td>`);
        newRow.append(`<td>${data.excludedDates.join(", ")}</td>`);
        newRow.append(`<td>${data.numDays}</td>`);
        newRow.append(`<td>${data.numLeads}</td>`);
        newRow.append(`<td>${(data.numLeads / data.numDays).toFixed(2)}</td>`); // Calculate expected DRR
        newRow.append(`<td>${getCurrentDate()}</td>`);

        // Append the new row to the table's tbody
        $("#data-table tbody").append(newRow);
    }

    // Populate the table with data from localStorage when the page loads
    populateTableFromLocalStorage();


    // Handle the "Save" button click
    $("#save-button").click(function() {
        // Simulate a successful response
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const response = {
            startDate: $("#start-date").datepicker("getDate").toLocaleDateString('en-US', options),
            endDate: $("#end-date").datepicker("getDate").toLocaleDateString('en-US', options),
            excludedDates: excludedDates,
            numLeads: $("#lead-count").val(),
            numDays: parseInt($("#num-days").text())
        };

        // Save the data to localStorage
        saveDataToLocalStorage(response);

        // Create a new row
        createNewRow(response);

        // Clear the form or perform any other necessary actions
    });

    function saveDataToLocalStorage(data) {
        const storedData = JSON.parse(localStorage.getItem('myData')) || [];
        storedData.push(data);
        localStorage.setItem('myData', JSON.stringify(storedData));
    }



    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});