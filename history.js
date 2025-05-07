// Get tasks from localStorage
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Get today's date and start of week
const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

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

// Get date range for display
function getDateRange(isWeekly) {
    if (isWeekly) {
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${formatDateDisplay(startOfWeek)} - ${formatDateDisplay(endOfWeek)}`;
    }
    return formatDateDisplay(today);
}

// Filter tasks based on view type
function getFilteredTasks(isWeekly) {
    if (isWeekly) {
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return tasks.filter(task => {
            const taskDate = new Date(task.addedDate);
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
    } else {
        return tasks.filter(task => {
            const taskDate = new Date(task.addedDate);
            return taskDate.toDateString() === today.toDateString();
        });
    }
}

// Update chart and statistics
function updateView(isWeekly) {
    const filteredTasks = getFilteredTasks(isWeekly);
    const completedTasks = filteredTasks.filter(task => task.completed).length;
    const incompleteTasks = filteredTasks.filter(task => !task.completed).length;

    // Update statistics
    document.getElementById('completedCount').textContent = completedTasks;
    document.getElementById('incompleteCount').textContent = incompleteTasks;
    document.getElementById('statsTitle').textContent = isWeekly ? 'This Week\'s Tasks' : 'Today\'s Tasks';
    document.getElementById('dateRange').textContent = getDateRange(isWeekly);

    // Update chart
    taskChart.data.datasets[0].data = [completedTasks, incompleteTasks];
    taskChart.options.plugins.title.text = isWeekly ? 'This Week\'s Task Completion' : 'Today\'s Task Completion';
    taskChart.update();

    // Update task list
    updateTaskList(filteredTasks, currentFilter);
}

// Create task list item
function createTaskListItem(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : 'incomplete';
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    taskInfo.innerHTML = `
        <span class="task-date">Added: ${formatDateDisplay(new Date(task.addedDate))} at ${formatTimeDisplay(new Date(task.addedDate))}</span>
        ${task.completed ? `<span class="completion-date">Completed: ${formatDateDisplay(new Date(task.completedDate))} at ${formatTimeDisplay(new Date(task.completedDate))}</span>` : ''}
    `;
    
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskInfo);
    li.appendChild(taskContent);
    
    return li;
}

// Current filter state
let currentFilter = 'all';

// Update task list
function updateTaskList(tasks, filter) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });
    
    if (filteredTasks.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-tasks';
        li.textContent = 'No tasks found';
        taskList.appendChild(li);
        return;
    }
    
    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskListItem(task));
    });
}

// Create the pie chart
const ctx = document.getElementById('taskChart').getContext('2d');
const taskChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Completed', 'Incomplete'],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                '#4CAF50',  // Green for completed
                '#FF5252'   // Red for incomplete
            ],
            borderColor: [
                '#388E3C',  // Darker green
                '#D32F2F'   // Darker red
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'white',
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: 'Today\'s Task Completion',
                color: 'white',
                font: {
                    size: 18
                }
            }
        }
    }
});

// Toggle view buttons
const dailyViewBtn = document.getElementById('dailyView');
const weeklyViewBtn = document.getElementById('weeklyView');

dailyViewBtn.addEventListener('click', () => {
    dailyViewBtn.classList.add('active');
    weeklyViewBtn.classList.remove('active');
    updateView(false);
});

weeklyViewBtn.addEventListener('click', () => {
    weeklyViewBtn.classList.add('active');
    dailyViewBtn.classList.remove('active');
    updateView(true);
});

// Task list filter buttons
const showAllTasksBtn = document.getElementById('showAllTasks');
const showCompletedTasksBtn = document.getElementById('showCompletedTasks');
const showIncompleteTasksBtn = document.getElementById('showIncompleteTasks');

function updateFilterButtons(activeButton) {
    [showAllTasksBtn, showCompletedTasksBtn, showIncompleteTasksBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

showAllTasksBtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons(showAllTasksBtn);
    document.getElementById('taskListTitle').textContent = 'All Tasks';
    updateView(dailyViewBtn.classList.contains('active') ? false : true);
});

showCompletedTasksBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    updateFilterButtons(showCompletedTasksBtn);
    document.getElementById('taskListTitle').textContent = 'Completed Tasks';
    updateView(dailyViewBtn.classList.contains('active') ? false : true);
});

showIncompleteTasksBtn.addEventListener('click', () => {
    currentFilter = 'incomplete';
    updateFilterButtons(showIncompleteTasksBtn);
    document.getElementById('taskListTitle').textContent = 'Incomplete Tasks';
    updateView(dailyViewBtn.classList.contains('active') ? false : true);
});

// Toggle sidebar
const toggleBtn = document.getElementById('toggleBtn');
const sideNav = document.getElementById('side-nav');

toggleBtn.addEventListener('click', () => {
    sideNav.classList.toggle('collapsed');
});

// Initialize with daily view
updateView(false); 