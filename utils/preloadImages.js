export const preloadImages = (urls) => {
    if (!urls || urls.length === 0) return;
    
    const uniqueUrls = [...new Set(urls)];
    
    uniqueUrls.forEach((url, index) => {
        const img = new Image();
        
        if (index < 3) {
            img.fetchPriority = 'high';
        } else {
            img.fetchPriority = 'low';
        }
        
        img.loading = 'eager';
        img.decoding = 'async';
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {};
        img.onerror = () => {};
        
        img.src = url;
    });
};
