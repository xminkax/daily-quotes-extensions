class DailyQuotesExtension {
    constructor() {
        this.quotes = [];
        this.currentQuote = null;
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.timeDisplay = document.getElementById('time-display');
        
        this.init();
    }

    async init() {
        // Add initial loading classes for smooth entry animation
        const quoteContainer = document.querySelector('.quote-container');
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        
        // Set initial state to prevent content jump
        quoteContainer.classList.add('initial-load');
        quoteText.classList.add('initial-load');
        quoteAuthor.classList.add('initial-load');
        
        // Clear initial content to prevent flash
        quoteText.textContent = '';
        quoteAuthor.textContent = '';
        
        await this.loadQuotes();
        this.setupEventListeners();
        this.updateTime();
        
        // Load and display quote immediately to prevent layout shift
        await this.displayDailyQuote();
        
        // Transition to natural height smoothly after all animations complete
        setTimeout(() => {
            this.transitionToNaturalHeight(quoteContainer);
        }, 2200);
        
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
    }

    async loadQuotes() {
        try {
            const response = await fetch('./quotes.json');
            const data = await response.json();
            this.quotes = data.quotes;
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Fallback quotes if file can't be loaded
            this.quotes = [
                {
                    text: "The only way to do great work is to love what you do.",
                    author: "Steve Jobs"
                },
                {
                    text: "Innovation distinguishes between a leader and a follower.",
                    author: "Steve Jobs"
                },
                {
                    text: "Life is what happens to you while you're busy making other plans.",
                    author: "John Lennon"
                }
            ];
        }
    }

    setupEventListeners() {
        this.refreshBtn.addEventListener('click', (e) => {
            this.handleRefreshClick(e.target);
            this.displayNewQuote();
        });

        // Keyboard shortcut for new quote (Space key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                this.handleRefreshClick(this.refreshBtn);
                this.displayNewQuote();
            }
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        this.timeDisplay.textContent = timeString;
    }

    getDailyQuoteIndex() {
        // Use current date as seed for consistent daily quote
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return dayOfYear % this.quotes.length;
    }

    getRandomQuoteIndex() {
        return Math.floor(Math.random() * this.quotes.length);
    }

    async displayDailyQuote() {
        // Show a random quote on each new tab open (per-load randomness)
        const quoteIndex = this.getRandomQuoteIndex();
        await this.animateQuoteTransition(this.quotes[quoteIndex], true);
        this.currentQuote = this.quotes[quoteIndex];
    }

    async displayNewQuote() {
        let newQuote;
        do {
            const randomIndex = this.getRandomQuoteIndex();
            newQuote = this.quotes[randomIndex];
        } while (newQuote === this.currentQuote && this.quotes.length > 1);

        await this.animateQuoteTransition(newQuote);
        this.currentQuote = newQuote;
    }

    async animateQuoteTransition(quote, isInitial = false) {
        const quoteContainer = document.querySelector('.quote-container');
        
        if (isInitial) {
            // For initial load, just set content without fade animation
            this.quoteText.textContent = `"${quote.text}"`;
            this.quoteAuthor.textContent = `— ${quote.author}`;
            
            // Remove initial classes after a delay to allow entry animation
            setTimeout(() => {
                this.quoteText.classList.remove('initial-load');
                this.quoteAuthor.classList.remove('initial-load');
                quoteContainer.classList.remove('initial-load');
            }, 1500);
            return;
        }
        
        // Calculate current height before content change
        const currentHeight = quoteContainer.offsetHeight;
        
        // Set current height explicitly to enable smooth transition
        quoteContainer.style.height = currentHeight + 'px';
        
        // For subsequent quotes, use smooth transition
        this.quoteText.classList.add('quote-fade-out');
        this.quoteAuthor.classList.add('quote-fade-out');

        // Wait for fade-out animation (0.3s)
        await this.delay(300);

        // Create a temporary container to measure new content height
        const tempContainer = quoteContainer.cloneNode(true);
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.height = 'auto';
        tempContainer.style.top = '-9999px';
        
        // Update content in temp container
        const tempQuoteText = tempContainer.querySelector('#quote-text');
        const tempQuoteAuthor = tempContainer.querySelector('#quote-author');
        tempQuoteText.textContent = `"${quote.text}"`;
        tempQuoteAuthor.textContent = `— ${quote.author}`;
        
        // Add temp container to DOM to measure
        document.body.appendChild(tempContainer);
        const newHeight = tempContainer.offsetHeight;
        document.body.removeChild(tempContainer);
        
        // Update actual content
        this.quoteText.textContent = `"${quote.text}"`;
        this.quoteAuthor.textContent = `— ${quote.author}`;
        
        // Animate to new height with 0.3s ease transition
        quoteContainer.style.height = newHeight + 'px';

        // Remove fade-out and add fade-in
        this.quoteText.classList.remove('quote-fade-out');
        this.quoteAuthor.classList.remove('quote-fade-out');
        this.quoteText.classList.add('quote-fade-in');
        this.quoteAuthor.classList.add('quote-fade-in');

        // Clean up fade-in class and height style after animation
        setTimeout(() => {
            this.quoteText.classList.remove('quote-fade-in');
            this.quoteAuthor.classList.remove('quote-fade-in');
            
            // Remove height constraint after 1s transition
            setTimeout(() => {
                quoteContainer.style.height = '';
            }, 1100); // Slightly longer than 1s to ensure transition completes
        }, 300); // Keep fade timing at 0.3s
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    handleRefreshClick(buttonElement) {
        // Add visual feedback for button click
        buttonElement.classList.add('clicked');
        
        // Remove the clicked class after animation completes
        setTimeout(() => {
            buttonElement.classList.remove('clicked');
        }, 600);
    }

    // Store/retrieve last viewed date to ensure daily quotes work properly
    async storeDailyQuoteData() {
        const today = new Date().toDateString();
        try {
            await chrome.storage.local.set({ lastQuoteDate: today });
        } catch (error) {
            // Fallback to localStorage if chrome.storage is not available
            localStorage.setItem('lastQuoteDate', today);
        }
    }

    async getStoredQuoteData() {
        try {
            const result = await chrome.storage.local.get(['lastQuoteDate']);
            return result.lastQuoteDate;
        } catch (error) {
            // Fallback to localStorage if chrome.storage is not available
            return localStorage.getItem('lastQuoteDate');
        }
    }
}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyQuotesExtension();
});

// Add some visual feedback for interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to any clickable elements
    document.querySelectorAll('button, .clickable').forEach(element => {
        element.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add subtle parallax effect to floating elements based on mouse movement
    document.addEventListener('mousemove', (e) => {
        const floatingElements = document.querySelectorAll('.floating-element');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const xMovement = (mouseX - 0.5) * speed;
            const yMovement = (mouseY - 0.5) * speed;
            
            // Set transform rather than appending to prevent accumulation
            element.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
        });
    });
});