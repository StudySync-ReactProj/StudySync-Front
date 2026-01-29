export const fetchFreeBusyData = async (userId, emails) => {
    // שליפת הטוקן של האפליקציה (לא של גוגל)
    const storedUserInfo = localStorage.getItem('userInfo');

    // extract the JWT token from stored user info

    let authToken = null;
    if (storedUserInfo) {
        const parsedInfo = JSON.parse(storedUserInfo);
        authToken = parsedInfo.token; // כאן נמצא ה-JWT האמיתי שלך
    }

    console.log("Verified Auth Token:", authToken);

    try {
        const response = await fetch('http://localhost:3000/api/google-calendar/freebusy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // עכשיו זה ישלח את הטוקן הנכון
            },
            body: JSON.stringify({
                userId,
                emails,
                timeMin: new Date().toISOString(),
                timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            // If user doesn't have Google connected, return empty calendars object
            if (response.status === 401 || !errorData.calendars) {
                console.log('ℹ️  Google Calendar not connected - returning empty availability');
                return { calendars: {} };
            }
            throw new Error(errorData.message || 'Failed to fetch availability');
        }
        return await response.json();
    } catch (error) {
        // If any error occurs, return empty calendars to prevent app crashes
        console.log('ℹ️  Error fetching freebusy data - returning empty availability:', error.message);
        return { calendars: {} };
    }
};