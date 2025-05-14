export const calculateTimeAgo = (date: string | Date): string => {
    const postDate = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        // If more than 1 day has passed, show the date only
        return postDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } else if (diffInHours > 0) {
        // If it's within the same day, show hours
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
        // If it's within the same hour, show minutes
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
        // If it's within the same minute, show seconds
        return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }
};
