// Apply theme when page loads
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('light-theme', savedTheme === 'light');
    }
    
    // Theme toggle button click handler
    themeToggleBtn.addEventListener('click', function() {
        body.classList.toggle('light-theme');
        // Save theme preference
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });
}); 