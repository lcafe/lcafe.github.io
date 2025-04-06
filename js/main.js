document.addEventListener('DOMContentLoaded', function() {
    const contentFrame = document.getElementById('content-frame');
    const navLinks = document.querySelectorAll('.nav a[data-target]');
    const themeToggle = document.getElementById('checkbox');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'light') {
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        syncThemeWithIframe(newTheme);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            this.parentElement.classList.add('active');
            
            const href = this.getAttribute('href');
            contentFrame.src = href;
        });
    });
    
    contentFrame.addEventListener('load', function() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        syncThemeWithIframe(currentTheme);
    });
    
    function syncThemeWithIframe(theme) {
        if (contentFrame.contentDocument) {
            contentFrame.contentDocument.body.setAttribute('data-theme', theme);
        }
        
        try {
            contentFrame.contentWindow.postMessage({
                action: 'setTheme',
                theme: theme
            }, '*');
        } catch (e) {
            console.log('Não foi possível enviar mensagem para o iframe');
        }
    }
    
    const githubAvatar = document.getElementById('github-avatar');
    if (githubAvatar) {
        githubAvatar.onerror = function() {
            console.log('Não foi possível carregar avatar do GitHub');
        };
    }
});
