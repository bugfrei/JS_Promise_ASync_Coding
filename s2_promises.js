// Mehrere Promise erstellen (3 Stück; das erste Random resolve/reject, die anderen immer resolve)
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
    resolveFunction("Job 2 ever successfull");
});

const promiseJob3 = new Promise((resolveFunction, rejectFunction) =>
{
    resolveFunction("Job 3 ever successfull");
});

// Wenn nur EINE Promise rejected ist, wird catch aufgerufen!!!
Promise.all(
    [promiseJob1, promiseJob2, promiseJob3])
    .then((messages) => console.log(messages))
    .catch((errors) => console.log(errors));
