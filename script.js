// Get tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterForm = document.getElementById('filterForm');
const filterInput = document.getElementById('filterInput');
const showAddFormBtn = document.getElementById('showAddFormBtn');
const showFilterFormBtn = document.getElementById('showFilterFormBtn');
const toggleBtn = document.getElementById('toggleBtn');
const sideNav = document.getElementById('side-nav');
const autoRepeatCheckbox = document.getElementById('autoRepeat');
const autoRepeatOptions = document.querySelector('.auto-repeat-options');

// Show/hide auto repeat options
autoRepeatCheckbox.addEventListener('change', () => {
    autoRepeatOptions.classList.toggle('hidden', !autoRepeatCheckbox.checked);
});

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format date for display
function formatDateDisplay(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format time for display
function formatTimeDisplay(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Check if deadline is overdue
function isOverdue(deadline) {
    return new Date(deadline) < new Date();
}

// Check if a date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

// Generate next occurrence date for auto-repeat tasks
function getNextOccurrence(task) {
    const lastDate = new Date(task.lastOccurrence || task.addedDate);
    const nextDate = new Date(lastDate);
    
    switch (task.repeatInterval) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
    }
    
    // Set the time from repeatTime
    const [hours, minutes] = task.repeatTime.split(':');
    nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return nextDate;
}

// Check and generate auto-repeat tasks
function checkAutoRepeatTasks() {
    const now = new Date();
    const newTasks = [];
    
    tasks.forEach(task => {
        if (task.autoRepeat && !task.completed) {
            const nextOccurrence = getNextOccurrence(task);
            
            if (nextOccurrence <= now) {
                // Create new task instance
                const newTask = {
                    id: Date.now() + Math.random(),
                    text: task.text,
                    completed: false,
                    addedDate: new Date(),
                    completedDate: null,
                    urgent: task.urgent,
                    deadline: task.deadline,
                    type: task.type,
                    autoRepeat: task.autoRepeat,
                    repeatInterval: task.repeatInterval,
                    repeatTime: task.repeatTime,
                    lastOccurrence: now
                };
                newTasks.push(newTask);
                
                // Update last occurrence of original task
                task.lastOccurrence = now;
            }
        }
    });
    
    if (newTasks.length > 0) {
        tasks = [...tasks, ...newTasks];
        saveTasks();
        renderTasks();
    }
}

// Clean up old tasks (older than a week)
function cleanupOldTasks() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    tasks = tasks.filter(task => {
        const taskDate = new Date(task.addedDate);
        return taskDate >= oneWeekAgo || task.autoRepeat;
    });
    
    saveTasks();
}

// Toggle sidebar
toggleBtn.addEventListener('click', () => {
    sideNav.classList.toggle('collapsed');
});

// Show/hide forms
showAddFormBtn.addEventListener('click', () => {
    taskForm.classList.remove('hidden');
    filterForm.classList.add('hidden');
});

showFilterFormBtn.addEventListener('click', () => {
    filterForm.classList.remove('hidden');
    taskForm.classList.add('hidden');
});

// Add Task
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    const isUrgent = document.getElementById('urgentTask').checked;
    const deadline = document.getElementById('taskDeadline').value;
    const taskType = document.getElementById('taskType').value;
    const autoRepeat = document.getElementById('autoRepeat').checked;
    const repeatInterval = document.getElementById('repeatInterval').value;
    const repeatTime = document.getElementById('repeatTime').value;
    
    if (text !== '' && taskType !== '') {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            addedDate: new Date(),
            completedDate: null,
            urgent: isUrgent,
            deadline: deadline || null,
            type: taskType,
            autoRepeat: autoRepeat,
            repeatInterval: autoRepeat ? repeatInterval : null,
            repeatTime: autoRepeat ? repeatTime : null,
            lastOccurrence: autoRepeat ? new Date() : null
        };
        tasks.push(task);
        taskInput.value = '';
        document.getElementById('urgentTask').checked = false;
        document.getElementById('taskDeadline').value = '';
        document.getElementById('taskType').value = '';
        document.getElementById('autoRepeat').checked = false;
        document.getElementById('repeatInterval').value = 'daily';
        document.getElementById('repeatTime').value = '09:00';
        autoRepeatOptions.classList.add('hidden');
        saveTasks();
        renderTasks();
    }
});

// Filter Tasks
filterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const filterText = filterInput.value.trim().toLowerCase();
    const filterType = document.getElementById('filterType').value;
    renderTasks(filterText, filterType);
});

// Create task list item
function createTaskListItem(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : 'incomplete';
    if (task.urgent) {
        li.classList.add('urgent');
    }
    if (task.autoRepeat) {
        li.classList.add('auto-repeat');
    }
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    if (task.completed) {
        taskText.classList.add('completed-text');
    }
    taskText.textContent = task.text;
    
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    if (task.completed) {
        taskInfo.classList.add('completed-info');
    }
    
    let infoHTML = `
        <span class="task-type">${task.type}</span>
        <span class="task-date">Added: ${formatDateDisplay(new Date(task.addedDate))} at ${formatTimeDisplay(new Date(task.addedDate))}</span>
    `;
    
    if (task.autoRepeat) {
        infoHTML += `
            <span class="auto-repeat-info">
                Repeats ${task.repeatInterval} at ${task.repeatTime}
            </span>
        `;
    }
    
    if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        const deadlineClass = isOverdue(task.deadline) && !task.completed ? 'overdue' : '';
        infoHTML += `
            <span class="task-deadline ${deadlineClass}">
                Deadline: ${formatDateDisplay(deadlineDate)} at ${formatTimeDisplay(deadlineDate)}
            </span>
        `;
    }
    
    if (task.completed) {
        infoHTML += `
            <span class="completion-date">Completed: ${formatDateDisplay(new Date(task.completedDate))} at ${formatTimeDisplay(new Date(task.completedDate))}</span>
        `;
    }
    
    taskInfo.innerHTML = infoHTML;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-task';
    deleteButton.innerHTML = '×';
    deleteButton.title = 'Delete task';
    
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        if (task.completed) {
            task.completedDate = new Date();
            taskText.classList.add('completed-text');
            taskInfo.classList.add('completed-info');
        } else {
            task.completedDate = null;
            taskText.classList.remove('completed-text');
            taskInfo.classList.remove('completed-info');
        }
        saveTasks();
        renderTasks(filterInput.value.trim().toLowerCase(), document.getElementById('filterType').value);
    });
    
    deleteButton.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks(filterInput.value.trim().toLowerCase(), document.getElementById('filterType').value);
    });
    
    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskInfo);
    li.appendChild(taskContent);
    li.appendChild(deleteButton);
    
    return li;
}

// Render Tasks
function renderTasks(filterText = '', filterType = '') {
    taskList.innerHTML = '';
    
    // Clean up old tasks first
    cleanupOldTasks();
    
    // Check for auto-repeat tasks
    checkAutoRepeatTasks();
    
    // Filter tasks for today and apply text and type filters
    const filteredTasks = tasks
        .filter(task => {
            const taskDate = new Date(task.addedDate);
            const matchesFilter = task.text.toLowerCase().includes(filterText);
            const matchesType = filterType === '' || task.type === filterType;
            return isToday(taskDate) && matchesFilter && matchesType;
        })
        .sort((a, b) => {
            // Sort by completion status first
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            // Then by urgency
            if (a.urgent !== b.urgent) {
                return a.urgent ? -1 : 1;
            }
            // Then by deadline (if both have deadlines)
            if (a.deadline && b.deadline) {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            // Tasks with deadlines come before those without
            if (a.deadline) return -1;
            if (b.deadline) return 1;
            // Finally by added date
            return new Date(b.addedDate) - new Date(a.addedDate);
        });
    
    if (filteredTasks.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-tasks';
        li.textContent = 'No tasks for today';
        taskList.appendChild(li);
        return;
    }
    
    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskListItem(task));
    });
}

// Check for auto-repeat tasks every minute
setInterval(checkAutoRepeatTasks, 60000);

// Initialize
renderTasks();