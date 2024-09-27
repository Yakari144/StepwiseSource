const ButtonScrollTo = ({id,className,selector,content}) => {

    const scrollToSelector = (selector) => {
        const targetElement = document.querySelector(selector);
        if (targetElement) {
            // Get the top position of the target element
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 2000;  // Duration of the scroll in milliseconds (2 seconds)
            let start = null;

            // Custom animation function
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const scrollStep = easeInOutQuad(progress, startPosition, distance, duration);
                window.scrollTo(0, scrollStep);
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            };

            // Start the animation
            window.requestAnimationFrame(step);
        }
    };

    // Easing function for smooth scroll effect (ease-in-out)
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    return (
        <button id={id} className={className} onClick={() => scrollToSelector(selector)}>
            {content}
        </button>
    );
}

export default ButtonScrollTo;
