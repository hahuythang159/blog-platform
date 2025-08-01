import { useEffect, useRef, useState } from 'react';

/**
 * A custom React hook for lazy loading items (e.g. posts) using Intersection Observer.
 * @param items - The full list of items to be displayed.
 * @param initialCount - The number of items to show initially (default is 10).
 * @param step - The number of items to load each time the observer is triggered (default is 5).
 * @returns An object containing the currently visible items, a ref for the loader element, and a boolean indicating if there are more items to load.
 */
const useLazyLoadPosts = <T>(items: T[], initialCount = 10, step = 5) => {
    // State to keep track of how many items are currently visible
    const [visibleCount, setVisibleCount] = useState(initialCount);

    // A reference to the DOM element that will trigger loading more items when it becomes visible
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!items || items.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                // If the observed element is fully in view
                if (entry.isIntersecting) {
                    // Increase the visible count by the step value, but don't exceed total item count
                    setVisibleCount((prev) => Math.min(prev + step, items.length));
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0, // Only trigger when the element is fully visible
            }
        );

        const current = loaderRef.current;

        // Start observing the loader element if it's available
        if (current) observer.observe(current);

        // Cleanup function to stop observing when the component unmounts or items change
        return () => {
            if (current) observer.unobserve(current);
        };
    }, [items, step]);

    const visibleItems = items.slice(0, visibleCount);

    // Boolean to indicate whether there are more items to load
    const hasMore = visibleCount < items.length;

    return { visibleItems, loaderRef, hasMore };
};

export default useLazyLoadPosts;
