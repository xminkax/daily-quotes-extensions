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
        // Load data first
        await this.loadQuotes();

        this.setupEventListeners();
        this.updateTime();

        // Make layout top-aligned and enable auto-sizing behavior
        this.enableTopAlignment();
        this.setupAutoSizing();

        // Populate the quote content
        this.displayDailyQuote();

        // Ensure layout is stable and fonts are ready before entry animation
        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (_) {}
        }
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        this.triggerInitialAnimation();

        setInterval(() => this.updateTime(), 60000);
    }

    enableTopAlignment() {
        // Inject small CSS overrides to:
        // - remove vertical centering
        // - allow page to grow and scroll if the quote is long
        // - let the box height be fully content-driven
        const css = `
          body { overflow: auto; }
          .container {
            min-height: 100vh;
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .quote-container { min-height: unset; }
          .quote-container.animating-height { overflow: clip; }
        `;
        const style = document.createElement('style');
        style.setAttribute('data-auto-sizing', 'true');
        style.textContent = css;
        document.head.appendChild(style);
    }

    setupAutoSizing() {
        const box = document.querySelector('.quote-container');
        if (!box) return;

        const text = document.getElementById('quote-text');
        const author = document.getElementById('quote-author');
        let prevHeight = box.offsetHeight || 0;
        let animating = false;
        let skipFirstMutation = true;

        const animateTo = (targetHeight) => {
            if (animating) return;
            animating = true;

            const start = prevHeight || box.offsetHeight;
            box.classList.add('animating-height');
            box.style.height = start + 'px';
            box.style.transition = 'height 240ms ease';

            requestAnimationFrame(() => {
                box.style.height = targetHeight + 'px';
            });

            const onEnd = (e) => {
                if (e && e.propertyName !== 'height') return;
                box.style.height = '';
                box.style.transition = '';
                box.classList.remove('animating-height');
                prevHeight = box.offsetHeight;
                animating = false;
                box.removeEventListener('transitionend', onEnd);
            };
            box.addEventListener('transitionend', onEnd);
        };

        const mo = new MutationObserver(() => {
            const nextHeight = box.scrollHeight;
            if (skipFirstMutation) {
                // Initialize without animating on the first content set
                prevHeight = nextHeight;
                skipFirstMutation = false;
                return;
            }
            if (Math.abs(nextHeight - prevHeight) > 1) {
                animateTo(nextHeight);
            }
        });

        if (text) mo.observe(text, { childList: true, characterData: true, subtree: true });
        if (author) mo.observe(author, { childList: true, characterData: true, subtree: true });

        // Keep our baseline height fresh on resizes (e.g., responsive reflow, font changes)
        window.addEventListener('resize', () => {
            prevHeight = box.offsetHeight;
        });
    }

    triggerInitialAnimation() {
        const quoteContainer = document.querySelector('.quote-container');
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');

        // Force reflow to ensure the animation starts from the initial state
        if (quoteContainer) void quoteContainer.offsetHeight;

        quoteContainer?.classList.add('initial-load');
        quoteText?.classList.add('initial-load');
        quoteAuthor?.classList.add('initial-load');
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
            // For initial load, just set content without fade animation
            this.quoteText.textContent = `"${quote.text}"`;
            this.quoteAuthor.textContent = `— ${quote.author}`;
            
            // Remove initial classes after a delay to allow entry animation
            setTimeout(() => {
                this.quoteText.classList.remove('initial-load');
                this.quoteAuthor.classList.remove('initial-load');
                document.querySelector('.quote-container').classList.remove('initial-load');
            }, 500);
            return;
        }
        
        // For subsequent quotes, use smooth transition
        this.quoteText.classList.add('quote-fade-out');
        this.quoteAuthor.classList.add('quote-fade-out');

        // Wait for fade-out animation
        await this.delay(2000);

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
        }, 1500);
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
            
            // Set transform rather than appending to prevent accumulation
            element.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
        });
    });
});

function animateContentResize(shellEl, bodyEl, updateContent) {
  // shellEl: the blurred box (keep its size mostly stable)
  // bodyEl: inner content wrapper you transform
  // updateContent: function that mutates to the new text/author

  // First: measure current geometry
  const first = bodyEl.getBoundingClientRect();

  // Update content to final state
  updateContent();

  // Wait a frame so the browser applies the new layout
  requestAnimationFrame(() => {
    const last = bodyEl.getBoundingClientRect();

    // Compute deltas
    const dy = first.top - last.top;
    const sy = first.height > 0 ? first.height / last.height : 1;

    // Prepare animation (from old geometry to new)
    bodyEl.animate(
      [
        { transformOrigin: 'top left', transform: `translateY(${dy}px) scaleY(${sy})`, opacity: 0.9 },
        { transformOrigin: 'top left', transform: 'none', opacity: 1 }
      ],
      { duration: 350, easing: 'cubic-bezier(0.4,0,0.2,1)' }
    );
  });
}

function revealWithClip(wrapperEl, updateContent) {
  wrapperEl.classList.remove('reveal'); // start clipped
  updateContent();
  // next frame, animate to unclipped
  requestAnimationFrame(() => wrapperEl.classList.add('reveal'));
}

async function animateHeight(el, targetHeight, duration = 350) {
  document.documentElement.classList.add('is-resizing');
  const start = el.offsetHeight;
  el.style.height = start + 'px';
  el.style.transition = `height ${duration}ms cubic-bezier(0.4,0,0.2,1)`;

  // next frame to start transition
  await new Promise(r => requestAnimationFrame(r));
  el.style.height = targetHeight + 'px';

  await new Promise((resolve) => {
    const onEnd = (e) => { if (e.propertyName === 'height') { el.removeEventListener('transitionend', onEnd); resolve(); } };
    el.addEventListener('transitionend', onEnd);
  });

  el.style.height = ''; // back to auto
  el.style.transition = '';
  document.documentElement.classList.remove('is-resizing');
}