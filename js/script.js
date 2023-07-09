document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.getElementById("taskContainer");

    // create buttons and assign function
    const addButton = document.getElementById("addButton");
    addButton.classList.add("main-button");
    addButton.addEventListener("click", createTaskElement);

    const stopAllButton = document.getElementById("stopAllButton");
    stopAllButton.classList.add("main-button");
    stopAllButton.addEventListener("click", stopAllTimers);

    const stopAndRemoveAllButton = document.getElementById("removeAllButton");
    stopAndRemoveAllButton.classList.add("main-button");
    stopAndRemoveAllButton.addEventListener("click", stopAndRemoveAllTimers);

    // Global variables
    let activeTimer = null; // Variable to track the active timer
    let zIndexCounter = 1;
    const maxTimeout = 8 * 3600; // Max timeout per timer in seconds (8 hours)

    // Function to create a new timer element
    function createTaskElement() {
        // create variable
        let elapsedTime = 0;

        // create element
        const element = document.createElement("div");
        element.classList.add("element");
        element.style.backgroundColor = getRandomColor();
        element.draggable = true;

        // create text field: Custom Name
        const nameInput = document.createElement("input");
        nameInput.classList.add("name-input");
        nameInput.type = "text";
        nameInput.placeholder = "please give me names";
        nameInput.style.position = "relative";

        // create timer field: stopwatch
        const timerId = "timer-" + zIndexCounter; // Generate a unique ID for the timer element
        zIndexCounter++; // Increment zIndexCounter after setting the timer ID
        const timerElement = document.createElement("div");
        timerElement.classList.add("timer");
        timerElement.setAttribute("id", timerId);
        timerElement.textContent = formatTime(elapsedTime);
        timerElement.timerId = timerId

        // create button: start
        const startButton = document.createElement("button");
        startButton.classList.add("start-button");
        startButton.textContent = "Start";
        startButton.addEventListener("click", function () {
            // only one timer should run at the same time
                startTimer(timerElement);
            });

        // create button: stop
        const stopButton = document.createElement("button");
        stopButton.classList.add("stop-button");
        stopButton.textContent = "Stop";
        stopButton.addEventListener("click", function () {
                stopTimer(timerElement);
            });

        // create button: change bg color of myself
        const colorButton = document.createElement("button");
        colorButton.classList.add("color-button");
        colorButton.textContent = "Change Color";
        colorButton.addEventListener("click", function () {
            changeTimerColor(element);
            });

        // create button: delete myself
        const killButton = document.createElement("button");
        killButton.classList.add("kill-button");
        killButton.textContent = "Kill this Timer";
        killButton.addEventListener("click", function () {
                killThisTimer(element);
            });

        // create checkbox: when checkbox is active, do never stop this timer even if another is started. run parallel
        const activateCheckbox = document.createElement("input");
        activateCheckbox.type = "checkbox";
        activateCheckbox.addEventListener("change", function () {
            if (activateCheckbox.checked) {
                //later
            }
        });    

        // Function to start the timer
        function startTimer(timerElement) {

            let startTime = Date.now() - (elapsedTime * 1000);
            let intervalId;
        
            const updateTimer = () => {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - startTime) / 1000);
        
            const seconds = elapsed % 60;
            const minutes = Math.floor((elapsed / 60) % 60);
            const hours = Math.floor(elapsed / 3600);
        
            // Update the timer display within the timer element
            timerElement.textContent = formatTime(elapsed);

            // Add Style
            timerElement.classList.add("timer-active");

            // Update the elapsed time variable
            elapsedTime = elapsed;

            };
        
            // Clear any existing interval associated with the timer element
            clearInterval(timerElement.timerId);
        
            // Start the timer by updating it immediately and then every second
            updateTimer();
            intervalId = setInterval(updateTimer, 1000);
        
            // Store the intervalId on the timer element for later reference
            timerElement.timerId = intervalId;

            // change style
            timerElement.classList.add("timer");

        }

        // Function to change the background color of the timer
        function changeTimerColor() {
            element.style.backgroundColor = getRandomColor();
        }

        element.appendChild(nameInput);
        element.appendChild(timerElement);
        element.appendChild(startButton);
        element.appendChild(stopButton);
        element.appendChild(killButton);
        element.appendChild(colorButton);
        taskContainer.appendChild(element);

        // make element draggable
        makeElementDraggable(element);
    }

    // Function to make an element draggable
    function makeElementDraggable(element) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        element.addEventListener("mousedown", dragMouseDown);

        function dragMouseDown(event) {
            // Check if the event target is the text field
            if (event.target.tagName !== "INPUT") {
            event.preventDefault();
            pos3 = event.clientX;
            pos4 = event.clientY;
            document.addEventListener("mouseup", closeDragElement);
            document.addEventListener("mousemove", elementDrag);
        }
    }

    function elementDrag(event) {
        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
    
        // Calculate the new position of the element
        const newTop = element.offsetTop - pos2;
        const newLeft = element.offsetLeft - pos1;
    
        // Check for collision with other elements
        //const collidingElement = checkCollision(element, newTop, newLeft);
    
        //if (!collidingElement) {
          // Update the position if no collision occurs
          element.style.top = newTop + "px";
          element.style.left = newLeft + "px";
        //}
      }
    
    function closeDragElement() {
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
      }
    }

    // Function to set the active timer
    function setActiveTimer(timerElement) {
        activeTimer = timerElement;
    }

    // Function to stop the timer
    function stopTimer(timerElement) {
        if (timerElement.timerId) {
            // Remove Style
            timerElement.classList.remove("timer-active");

            // stop Timer
            clearInterval(timerElement.timerId);
            timerElement.timerId = null;
        }
        }

    // Function to stop all timers
    function stopAllTimers() {

        // get all timer Elements from document
        const timerElements = document.getElementsByClassName("timer");

        // stop them all
        Array.from(timerElements).forEach(function (timerElement) {
            // Remove Style
            timerElement.classList.remove("timer-active");

            // Stop Timer
            return clearInterval(timerElement.timerId);
        });

        //timerElements.clear();

      }

    // Function to stop the active timer
    function stopActiveTimer() {
        if (activeTimer) {
    
        // stop timer
        //clearTimeout(activeTimer.timerId);
        stopTimer(activeTimer);

        // clear active Timer
        //activeTimer = null;

        }
    }

    // Function to stop and remove all timers
    function stopAndRemoveAllTimers() {
        stopAllTimers();
    
        // get all timers
        const taskElements = document.getElementsByClassName("element");
    
        // remove all timers
        Array.from(taskElements).forEach(function (element) {
            console.log("This is elment: " + element)
            element.remove();
            
        });
    }

    // Function to remove a single timer
    function killThisTimer(element){
        // remove it
        element.remove();

    }

    // Function to format time in hours, minutes, and seconds
    function formatTime(timeInSeconds) {

        // calculate time
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        // return
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}.${seconds.toString().padStart(2, "0")}`;
    }

    // Function to generate a random color in pastel shades
    function getRandomColor() {

        // get random values
        const hue = Math.floor(Math.random() * 360);
        
        // get saturation
        const pastelSaturation = Math.floor(Math.random() * 30) + 70;

        // get lightness
        const pastelLightness = Math.floor(Math.random() * 30) + 50;
        
        // return
        return `hsl(${hue}, ${pastelSaturation}%, ${pastelLightness}%)`;
    }

});
