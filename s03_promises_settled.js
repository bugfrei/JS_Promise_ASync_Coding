const promiseJob1 = new Promise((resolveFunction, rejectFunction) =>
{
    const isJobSuccess = Math.random() > 0.5 ? true : false;

    if (isJobSuccess)
    {
        // Kann alles mögliche sein, von ein bool, int, string, array, object... Geht alles
        resolveFunction("Job 1 successfull");
    }
    else
    {
        rejectFunction("Job 1 failed");
    }

});

const promiseJob2 = new Promise((resolveFunction, rejectFunction) =>
{
    rejectFunction("Job 2 ever failed");
    //resolveFunction("Job 2 ever successfull");
});

const promiseJob3 = new Promise((resolveFunction, rejectFunction) =>
{
    rejectFunction("Job 3 ever failed");
    //resolveFunction("Job 3 ever successful");
});

// Wir bekommen immer ein Array aller Jobs zurück
// Es wird immer .then() aufgerufen, .catch() muss nicht angegeben werden.
Promise.allSettled(
    [promiseJob1, promiseJob2, promiseJob3])
    .then((messages) => { console.log("Result:"); console.log(messages); });


