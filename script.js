class DailyQuotesExtension {
    constructor() {
        this.quotes = [];
        this.currentQuote = null;
        this.isAnimating = false;
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.nextQuoteText = document.getElementById('next-quote-text');
        this.nextQuoteAuthor = document.getElementById('next-quote-author');
        this.currentQuoteCard = document.getElementById('current-quote-card');
        this.nextQuoteCard = document.getElementById('next-quote-card');
        this.quoteWrapper = document.querySelector('.quote-wrapper');
        this.quoteContainer = document.querySelector('.quote-container');
        this.refreshBtn = document.getElementById('refresh-btn');
        // removed: this.timeDisplay = document.getElementById('time-display');

        this.init();
    }

    async init() {
        // Load data first
        await this.loadQuotes?.();

        this.setupEventListeners?.();

        // removed: this.updateTime();

        // Layout helpers (keep your existing ones if present)
        this.enableTopAlignment?.();
        this.setupAutoSizing?.();

        // Populate the quote content
        this.displayDailyQuote?.();

        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (_) {}
        }
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        this.triggerInitialAnimation?.();

        // removed: setInterval(() => this.updateTime(), 60000);
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
            e.preventDefault();
            this.handleRefreshClick(this.refreshBtn);
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
        if (isInitial) {
            // For initial load, set content first
            this.quoteText.textContent = `"${quote.text}"`;
            this.quoteAuthor.textContent = `— ${quote.author}`;
            
            // Small delay to ensure content is rendered, then show container
            await this.delay(50);
            
            // Remove inline style and add ready class to show container
            this.quoteContainer.style.opacity = '';
            this.quoteContainer.style.visibility = '';
            this.quoteContainer.classList.add('ready');
            
            // Remove initial classes after container is visible and animation completes
            setTimeout(() => {
                this.quoteText.classList.remove('initial-load');
                this.quoteAuthor.classList.remove('initial-load');
                this.quoteContainer.classList.remove('initial-load');
            }, 1500);
            return;
        }
        
        // Use deck swap animation for subsequent quotes
        await this.animateDeckSwap(quote);
    }

    async animateDeckSwap(quote) {
        // Prevent multiple animations from running simultaneously
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        // Add deck swap classes to container
        this.quoteContainer.classList.add('deck-swap-enhanced');
        
        // Prepare the next quote on the back card
        this.nextQuoteText.textContent = `"${quote.text}"`;
        this.nextQuoteAuthor.textContent = `— ${quote.author}`;
        
        // Ensure the back card is properly positioned
        this.nextQuoteCard.style.opacity = '1';
        this.nextQuoteCard.style.transform = 'rotateY(180deg)';
        
        // Start the flip animation
        this.currentQuoteCard.classList.add('flip-out');
        this.nextQuoteCard.classList.add('flip-in');
        
        // Wait for the flip animation to complete
        await this.delay(1000);
        
        // Swap the cards
        this.quoteText.textContent = `"${quote.text}"`;
        this.quoteAuthor.textContent = `— ${quote.author}`;
        
        // Reset card states
        this.currentQuoteCard.classList.remove('flip-out');
        this.nextQuoteCard.classList.remove('flip-in');
        
        // Reset the back card position
        this.nextQuoteCard.style.opacity = '0';
        this.nextQuoteCard.style.transform = 'rotateY(180deg)';
        
        // Clean up classes after animation
        setTimeout(() => {
            this.quoteContainer.classList.remove('deck-swap-enhanced');
            this.isAnimating = false;
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    handleRefreshClick(buttonElement) {
        // Remove any existing clicked class to reset animation
        buttonElement.classList.remove('clicked');
        
        // Force a reflow to ensure the class removal is processed
        buttonElement.offsetHeight;
        
        // Small delay to ensure reset is complete
        setTimeout(() => {
            // Add visual feedback for button click
            buttonElement.classList.add('clicked');
            
            // Remove the clicked class after animation completes
            setTimeout(() => {
                buttonElement.classList.remove('clicked');
            }, 1000); // Match the deck swap animation duration
        }, 10);
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