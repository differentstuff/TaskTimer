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

        // create div 1
        const elementDiv1 = document.createElement("div");
        elementDiv1.classList.add("elementDiv1");

        // create div 1a
        const elementDiv1a = document.createElement("div");
        elementDiv1a.classList.add("elementDiv1a");

        // create div 2
        const elementDiv2 = document.createElement("div");
        elementDiv2.classList.add("elementDiv2");
        
        // create div 2a
        const elementDiv2a = document.createElement("div");
        elementDiv2a.classList.add("elementDiv2a");

        // create div 2b
        const elementDiv2b = document.createElement("div");
        elementDiv2b.classList.add("elementDiv2b");

        // create text field
        const nameInput = document.createElement("input");
        nameInput.classList.add("element-field-name");
        nameInput.type = "text";
        nameInput.placeholder = "What should I do?";

        // create number field
        const timeInput = document.createElement("input");
        timeInput.classList.add("element-field-number");
        timeInput.type = "number";

        // create checkbox
        const timeInputCheckbox = document.createElement("input");
        timeInputCheckbox.classList.add("element-checkbox-number");
        timeInputCheckbox.type = "checkbox";
        timeInputCheckbox.name = "checkbox";
    
        // create checkbox label
        const timeInputCheckboxLabel = document.createElement('label');
        timeInputCheckboxLabel.classList.add("element-checkbox-label");
        timeInputCheckboxLabel.textContent = "Alarm in Min.: ";

        // create timerId counter
        const timerId = "timer-" + zIndexCounter; // Generate a unique ID for the timer element
        zIndexCounter++; // Increment zIndexCounter after setting the timer ID
        
        // create timer field: stopwatch
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
                startTimer(timerElement);
            });

        // create button: stop
        const stopButton = document.createElement("button");
        stopButton.classList.add("stop-button");
        stopButton.textContent = "Stop";
        stopButton.addEventListener("click", function () {
                stopTimer(timerElement);
            });

        // create button: change bg color
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

        // Function to start the timer
        function startTimer(timerElement) {

            let startTime = Date.now() - (elapsedTime * 1000);
            let intervalId;
        
            const durationInput = timerElement.querySelector(".duration-input");
            const desiredTime = parseInt(durationInput, 10); // Get the desired time from the input field

            const updateTimer = () => {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - startTime) / 1000);
        
            // Update the timer display within the timer element
            timerElement.textContent = formatTime(elapsed);

            // Add Style
            timerElement.classList.add("timer-active");

            // Update the elapsed time variable
            elapsedTime = elapsed;

            // Check if the timer has reached a specific time (e.g., 10 minutes)
            if (elapsed >= desiredTime) {
                // Execute the desired code or function
                handleTimerReachedTime(timerElement);
            }

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

        // Function to handle the timer reaching a specific time
        function handleTimerReachedTime(timerElement) {
            // Do something when the timer reaches the desired time
            console.log("Timer reached the desired time!");
            // You can add your custom code or function call here
            }

        // Function to change the background color of the timer
        function changeTimerColor() {
            element.style.backgroundColor = getRandomColor();
        }

        element.appendChild(elementDiv1);
        elementDiv1.appendChild(nameInput);
        elementDiv1.appendChild(timerElement);
        elementDiv1.appendChild(elementDiv1a);
        elementDiv1a.appendChild(timeInputCheckbox);
        elementDiv1a.appendChild(timeInputCheckboxLabel);
        elementDiv1a.appendChild(timeInput);
        element.appendChild(elementDiv2);
        element.appendChild(elementDiv2a);
        elementDiv2a.appendChild(startButton);
        elementDiv2a.appendChild(stopButton);
        element.appendChild(elementDiv2b);
        elementDiv2b.appendChild(killButton);
        elementDiv2b.appendChild(colorButton);
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

    // Function to stop and remove all timers
    function stopAndRemoveAllTimers() {
        stopAllTimers();
    
        // get all timers
        const taskElements = document.getElementsByClassName("element");
    
        // remove all timers
        Array.from(taskElements).forEach(function (element) {
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
