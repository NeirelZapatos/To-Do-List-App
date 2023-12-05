class TodoList {
    constructor() {
        // if an instance of the to-do list does not exist
        if (!TodoList.instance) {
            this.nukeButton = document.querySelector('.nukebutton');
            this.textInput = document.querySelector('.textarea');
            this.dateInput = document.querySelector('#date-picker');
            this.buttonInput = document.querySelector('.add-new-item-btn');
            this.itemList = document.querySelector('#items-container');
            this.darkModeToggle = document.getElementById('dark-mode-toggle');
        
            this.initiateEventListeners();
            this.showTask();

            TodoList.instance = this;
        }
        
        return TodoList.instance;
    }

    initiateEventListeners() { 
        this.buttonInput.addEventListener('click', (event) => this.addItem(event));
        this.itemList.addEventListener('click', (event) => this.deleteItem(event));
        this.itemList.addEventListener('click', (event) => this.checkItem(event));
        this.textInput.addEventListener('keypress', (event) => this.enterKey(event));
        this.dateInput.addEventListener('keypress', (event) => this.enterKey(event));
        this.nukeButton.addEventListener('click', () => this.moveDiv());

        this.darkModeToggle.addEventListener('click', () => this.darkToggle());

        this.itemList.addEventListener('dragstart', (event) => this.handleDragStart(event));
        this.itemList.addEventListener('drop', (event) => this.handleDrop(event));
    }

    showTask() {
        // Retrieve the theme from localStorage
        const savedTheme = localStorage.getItem('theme');
    
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.querySelector('#movingDiv').classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('list-container').classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('title').classList.toggle('dark-mode', savedTheme === 'dark');
    
        this.itemList.innerHTML = localStorage.getItem("data");
    }

    addItem() {
        // if textbox is empty, do nothing
        if (this.textInput.value === '') {
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
    
            newItem.draggable = true; // makes items draggable    
            
            // create a button to check off items
            const checkbutton = document.createElement("button");
            // makes the text inside button to say check
            checkbutton.innerHTML = '<i class="fa-regular fa-circle-check fa-lg"></i>';
            // adds class
            checkbutton.classList.add("check-button");
            // adds checkButton to the newItem
            newItem.appendChild(checkbutton);
    
            // creates a container for itemContent and itemDate
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item-container');
    
            // creates an element for the text in our item
            const itemContent = document.createElement('p');
            // adds a class 'item' to the element
            itemContent.classList.add('itemContent');
            // the text of the element 'p' is what the text is in our query selector
            itemContent.innerText = this.textInput.value;
            // add the itemContent to the itemContainer div
            itemContainer.appendChild(itemContent);
    
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
                // add the itemContent to the itemContainer div
                itemContainer.appendChild(itemDate);
            }
    
            // add the itemContainer to the newItem div
            newItem.appendChild(itemContainer);
    
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
            this.itemList.appendChild(newItem);
    
            newItem.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
    
            // reset the text in textbox to blank to prep next input
            this.textInput.value = '';
            this.dateInput.value = '';
    
            gsap.to("#list-container, .newItem", .3, {paddingBottom: 30, ease: Back.easeOut})
            gsap.to("#list-container, .newItem", .3, {delay: .15, paddingBottom: 8, y: 0, ease: Back.easeOut})
    
            this.saveData();
        }
    }

    deleteItem(event) {
        console.log('Delete item function called');
        const item = event.target;
        console.log('Clicked element:', item);
        
        if(item.classList[0] === "trash-button") {
            const todolistitem = item.parentElement;
            console.log('Parent element:', todolistitem);
            
            todolistitem.remove();
            gsap.to("#list-container, .newItem", 0, {paddingBottom: 26});
            gsap.to("#list-container, .newItem", .3, {paddingBottom: 4, ease: Back.easeOut});
            this.saveData();
        }
    }

    moveDiv() {
        const div = document.getElementById('movingDiv');
        const screenHeight = window.innerHeight;
        
        setTimeout(() => {
            const items = document.querySelectorAll('#items-container .newItem');
            items.forEach(item => item.remove());
    
            localStorage.removeItem("data");
        }, 325);

        const animation = div.animate(
          [{ top: '-500px' }, { top: screenHeight * 1.85 - div.clientHeight + 'px'}],
          {
            duration: 750, // adjust the duration as needed
            iterations: 1,
            easing: 'ease-in-out'
          }
        );
    }

    checkItem(event) {
        // the item focused is the item that was clicked on
        const item = event.target
        // if the item clicked has the class "trashbutton"
        if(item.classList[0] === ("check-button")) {
            // todolistitem is set the the items parent eleemnt
           const todolistitem = item.parentElement
           // toggles the class 'checked' on or off
           todolistitem.classList.toggle('checked')
           this.saveData();
        }    
    }

    enterKey(event) {
        if (event.key === 'Enter') {
            this.addItem(event);
        }
    }

    handleDragStart(event) {
        console.log('Drag start:', event.target);

        event.dataTransfer.setData('text/plain', event.target.id);
    }

    handleDrop(event) {
        // Prevent default action (open as link for some elements)
        event.preventDefault();
        
        // Get the dragged item
        const draggedItemId = event.dataTransfer.getData('text/plain');
        const draggedItem = document.getElementById(draggedItemId);
        
        // Get the drop target
        const dropTarget = event.target.closest('.newItem');
        
        console.log('Dragged Item:', draggedItem);
        console.log('Drop Target:', dropTarget);
        
        if (dropTarget && draggedItem !== dropTarget) {
            // Insert the dragged item before the drop target
            dropTarget.parentNode.insertBefore(draggedItem, dropTarget);
            console.log('Inserting before:', dropTarget);
        }
    
        // Remove the 'dragging' class from the dragged item
        draggedItem.classList.remove('dragging');
        this.saveData();
    }

    darkToggle() {
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
    
        this.saveData();
    }

    saveData(){
        localStorage.setItem("data", this.itemList.innerHTML);
    }
}

const todoList = new TodoList();
