document.addEventListener('DOMContentLoaded', function() {
    // Theme switching functionality
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const body = document.body;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.getElementById(savedTheme + 'Theme').checked = true;
    body.className = savedTheme + '-theme';

    // Apply theme to all pages
    function applyTheme(theme) {
        body.className = theme + '-theme';
        localStorage.setItem('theme', theme);
        
        // Update theme on all pages
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html')) {
                const pageTheme = localStorage.getItem('theme');
                if (pageTheme) {
                    const pageBody = document.querySelector('body');
                    if (pageBody) {
                        pageBody.className = pageTheme + '-theme';
                    }
                }
            }
        });
    }

    themeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const theme = this.value;
            applyTheme(theme);
        });
    });

    // Email update functionality
    const emailForm = document.getElementById('emailForm');
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentEmail = document.getElementById('currentEmail').value;
        const newEmail = document.getElementById('newEmail').value;

        // Here you would typically make an API call to update the email
        // For now, we'll just show a success message
        alert('Email updated successfully!');
        emailForm.reset();
    });

    // Notification preferences
    const notificationCheckboxes = document.querySelectorAll('.notification-settings input[type="checkbox"]');
    
    // Load saved notification preferences
    notificationCheckboxes.forEach(checkbox => {
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
        }
    });

    notificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            localStorage.setItem(this.id, this.checked);
        });
    });

    // Task management settings
    const autoDeleteSelect = document.getElementById('autoDeleteDays');
    const applyTaskSettings = document.getElementById('applyTaskSettings');

    // Load saved auto-delete preference
    const savedAutoDelete = localStorage.getItem('autoDeleteDays');
    if (savedAutoDelete) {
        autoDeleteSelect.value = savedAutoDelete;
    }

    applyTaskSettings.addEventListener('click', function() {
        const days = autoDeleteSelect.value;
        localStorage.setItem('autoDeleteDays', days);
        alert('Task management settings updated!');
    });

    // Sidebar toggle functionality
    const toggleBtn = document.getElementById('toggleBtn');
    const sideNav = document.getElementById('side-nav');

    toggleBtn.addEventListener('click', function() {
        sideNav.classList.toggle('collapsed');
    });
}); 