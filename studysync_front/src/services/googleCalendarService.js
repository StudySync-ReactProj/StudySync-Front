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
        throw new Error(errorData.message || 'Failed to fetch availability');
    }
    return await response.json();
};