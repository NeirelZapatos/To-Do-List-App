const nukebutton = document.querySelector('.nukebutton');
// Grabs text
const textinput = document.querySelector('.textarea');
// Grabs date
const dateinput = document.querySelector('#date-picker');
// Grabs button input
const buttoninput = document.querySelector('.add-new-item-btn');
// Grabs the list of items in todo list
const itemlist = document.querySelector('#items-container');

const darkModeToggle = document.getElementById('dark-mode-toggle');

function clickButton(event) {
    // function to call addItem
    event.preventDefault();
    addItem()
} 

function addItem() {
     // if textbox is empty, do nothing
    if (textinput.value === '') {
        gsap.to("#list-container", .1, {x: -4})
        gsap.to("#list-container", .1, {delay: .1, x: 4})
        gsap.to("#list-container", .1, {delay: .2, x: -4})
        gsap.to("#list-container", .1, {delay: .3, x: 4})
        gsap.to("#list-container", .1, {delay: .4, x: 0})
        return;
    } else {
        // creates an element for the new item
        const newItem = document.createElement('div');

        // Generate a unique ID for the new item
        const itemId = 'item' + Date.now();

        // adds a class 'newItem' to the element
        newItem.classList.add('newItem');
        // Set the unique ID to the new item
        newItem.id = itemId;

        newItem.draggable = true; //makes items draggable    
        // create a button to check off items
        const checkbutton = document.createElement("button");
        // makes the text inside button to say check
        checkbutton.innerHTML = '<i class="fa-regular fa-circle-check fa-lg"></i>';
        // adds class
        checkbutton.classList.add("check-button");
        // adds checkButton to the newItem
        newItem.appendChild(checkbutton);
        
        // creates an element for the text in our item
        const itemContent = document.createElement('p');
        // adds a class 'item' to the element
        itemContent.classList.add('itemContent');
        // the text of the element 'p' is what the text is in our query selector
        itemContent.innerText = textinput.value;
        // add the itemContent to the newItem div
        newItem.appendChild(itemContent);


        // creates an element for the text in our item
        const userDate = document.getElementById('date-picker').value;
        const itemDate = document.createElement('p');
        // adds a class 'item' to the element
        itemDate.classList.add('itemDate');
        // the text of the element 'p' is what the text is in our query selector
        var selectedDate = new Date(userDate);
        if (!isNaN(selectedDate.getTime())) {
            itemDate.innerText = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            });
            // add the itemContent to the newItem div
            newItem.appendChild(itemDate);
        }

        // creates a button to delete items
        const trashbutton = document.createElement("button");
        // makes the text inside to say trash
        trashbutton.innerHTML = '<i class="fa-solid fa-trash btn"></i>';
        // adds class
        trashbutton.classList.add("trash-button");

        trashbutton.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));

        // add trashbutton to the newItem
        newItem.appendChild(trashbutton);

        // add the new item to the list of items
        itemlist.appendChild(newItem);

        newItem.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));

        // reset the text in textbox to blank to prep next input
        textinput.value = '';
        dateinput.value = '';

        gsap.to("#list-container, .newItem", .3, {paddingBottom: 30, ease: Back.easeOut})
        gsap.to("#list-container, .newItem", .3, {delay: .15, paddingBottom: 8, y: 0, ease: Back.easeOut})

        saveData();
    }
}

function deleteItem(event) {
    // the item focused is the item that was clicked on
    const item = event.target
    if(item.classList[0] === "trash-button") {
        // todolistitem is set the the items parent eleemnt
        const todolistitem = item.parentElement
        // remove item
        todolistitem.remove()

        gsap.to("#list-container, .newItem", 0, {paddingBottom: 26})
        gsap.to("#list-container, .newItem", .3, {paddingBottom: 4, ease: Back.easeOut})

        saveData();
    }
}

function moveDiv() {
    var div = document.getElementById('movingDiv');
    var screenHeight = window.innerHeight;
    
    setTimeout(function() {
        nukeItem();
    }, 325);

    var animation = div.animate(
      [{ top: '-500px' }, { top: screenHeight * 1.85 - div.clientHeight + 'px'}],
      {
        duration: 750, // adjust the duration as needed
        iterations: 1,
        easing: 'ease-in-out'
      }
    );
}

function nukeItem() {
    const items = document.querySelectorAll('.newItem');
    items.forEach(item => item.remove());

    localStorage.removeItem("data");
}

function checkItem(event) {
    // the item focused is the item that was clicked on
    const item = event.target
    // if the item clicked has the class "trashbutton"
    if(item.classList[0] === ("check-button")) {
        // todolistitem is set the the items parent eleemnt
       const todolistitem = item.parentElement
       // toggles the class 'checked' on or off
       todolistitem.classList.toggle('checked')
       saveData();
    }

}

function enterKey(event) {
    if (event.key === 'Enter') {
        addItem(event);
    }
}

function handleDragStart(event) {
    //store the dragged item
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    // prevents default to allow drop
    event.preventDefault();
}

function handleDrop(event) {
    // Prevent default action (open as link for some elements)
    event.preventDefault();

    // Get the dragged item
    const draggedItemId = event.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(draggedItemId);

    // Get the drop target
    const dropTarget = event.target.closest('.newItem');

    if (dropTarget) {
        // Insert the dragged item before the drop target
        dropTarget.parentNode.insertBefore(draggedItem, dropTarget);
    }

    // Remove the 'dragging' class from the dragged item
    draggedItem.classList.remove('dragging');
    saveData();
}

function handleDragEnd(event) {
    // remove the dragging class when drag operation is complete
    event.target.classList.remove('dragging');
}

function darkToggle(event) {
    document.body.classList.toggle('dark-mode');
    document.querySelector('#movingDiv').classList.toggle('dark-mode');
    document.getElementById('list-container').classList.toggle('dark-mode');
    document.getElementById('title').classList.toggle('dark-mode');

    const newItems = document.querySelectorAll('.newItem');
    const trashButtons = document.querySelectorAll('.trash-button');

    newItems.forEach((item) => {
        item.classList.toggle('dark-mode');
    });

    trashButtons.forEach((item) => {
        item.classList.toggle('dark-mode');
    });

    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');

    saveData();
}


function saveData(){
    localStorage.setItem("data", itemlist.innerHTML);
}

function showTask() {
    // Retrieve the theme from localStorage
    const savedTheme = localStorage.getItem('theme');

    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    document.querySelector('#movingDiv').classList.toggle('dark-mode', savedTheme === 'dark');
    document.getElementById('list-container').classList.toggle('dark-mode', savedTheme === 'dark');
    document.getElementById('title').classList.toggle('dark-mode', savedTheme === 'dark');

    itemlist.innerHTML = localStorage.getItem("data");
}

// checks for button clicks
buttoninput.addEventListener('click', clickButton)
itemlist.addEventListener('click', deleteItem)
itemlist.addEventListener('click', checkItem)
textinput.addEventListener('keypress',enterKey)
dateinput.addEventListener('keypress',enterKey)

// nuke all items
// nukebutton.addEventListener('click', nukeItem);
nukebutton.addEventListener('click', moveDiv);


//drag and drop event listeners
itemlist.addEventListener('dragstart', handleDragStart);
itemlist.addEventListener('dragover', handleDragOver);
itemlist.addEventListener('drop', handleDrop);
itemlist.addEventListener('dragend', handleDragEnd);

// dark mode event listener
darkModeToggle.addEventListener('click', darkToggle);
showTask();

checkbutton.addEventListener('click', () => {
    checkbutton.toggleClass('#27FDC7', black);
})
