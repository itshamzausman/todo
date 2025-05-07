// Get user data from localStorage
let userData = JSON.parse(localStorage.getItem('userData')) || {
    joinDate: new Date().toISOString(),
    username: 'User',
    profilePicture: 'default-avatar.png',
    taskHistory: []
};

// Get tasks from localStorage
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const profilePicture = document.getElementById('profilePicture');
const profilePictureInput = document.getElementById('profilePictureInput');
const joinDateElement = document.getElementById('joinDate');
const currentStreakElement = document.getElementById('currentStreak');
const completionRateElement = document.getElementById('completionRate');
const usernameForm = document.getElementById('usernameForm');
const passwordForm = document.getElementById('passwordForm');

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Calculate current streak
function calculateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;
    
    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasTaskForDate = tasks.some(task => {
            const taskDate = new Date(task.addedDate).toISOString().split('T')[0];
            return taskDate === dateStr;
        });
        
        if (!hasTaskForDate) break;
        
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

// Calculate completion rate
function calculateCompletionRate() {
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
}

// Update profile picture
profilePictureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicture.src = e.target.result;
            userData.profilePicture = e.target.result;
            localStorage.setItem('userData', JSON.stringify(userData));
        };
        reader.readAsDataURL(file);
    }
});

// Update username
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value.trim();
    if (newUsername) {
        userData.username = newUsername;
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Username updated successfully!');
        usernameForm.reset();
    }
});

// Update password
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Here you would typically verify the current password with your backend
    // For this example, we'll just check if the new passwords match
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    // Here you would typically update the password with your backend
    alert('Password updated successfully!');
    passwordForm.reset();
});

// Initialize page
function initializePage() {
    // Set profile picture
    profilePicture.src = userData.profilePicture;
    
    // Set join date
    joinDateElement.textContent = formatDate(userData.joinDate);
    
    // Calculate and set streak
    const streak = calculateStreak();
    currentStreakElement.textContent = `${streak} days`;
    
    // Calculate and set completion rate
    const completionRate = calculateCompletionRate();
    completionRateElement.textContent = `${completionRate}%`;
}

// Toggle sidebar
const toggleBtn = document.getElementById('toggleBtn');
const sideNav = document.getElementById('side-nav');

toggleBtn.addEventListener('click', () => {
    sideNav.classList.toggle('collapsed');
});

// Initialize the page
initializePage(); 