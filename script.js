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
        await this.loadQuotes();
        this.setupEventListeners();
        this.updateTime();
        this.displayDailyQuote();
        
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
        this.refreshBtn.addEventListener('click', () => {
            this.displayNewQuote();
        });

        // Keyboard shortcut for new quote (Space key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
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
        const quoteIndex = this.getDailyQuoteIndex();
        await this.animateQuoteTransition(this.quotes[quoteIndex]);
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

    async animateQuoteTransition(quote) {
        // Add fade-out class
        this.quoteText.classList.add('quote-fade-out');
        this.quoteAuthor.classList.add('quote-fade-out');

        // Wait for fade-out animation
        await this.delay(400);

        // Update content
        this.quoteText.textContent = `"${quote.text}"`;
        this.quoteAuthor.textContent = `— ${quote.author}`;

        // Remove fade-out and add fade-in
        this.quoteText.classList.remove('quote-fade-out');
        this.quoteAuthor.classList.remove('quote-fade-out');
        this.quoteText.classList.add('quote-fade-in');
        this.quoteAuthor.classList.add('quote-fade-in');

        // Clean up fade-in class after animation
        setTimeout(() => {
            this.quoteText.classList.remove('quote-fade-in');
            this.quoteAuthor.classList.remove('quote-fade-in');
        }, 800);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
            
            element.style.transform += ` translate(${xMovement}px, ${yMovement}px)`;
        });
    });
});