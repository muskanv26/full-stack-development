function f1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("task1");
            resolve();
        }, 4000);
    });
}

function f2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("task2");
            resolve();
        }, 2000);
    });
}

async function execute() {
    try {
        await(Promise.all([f1(), f2()]));
    } catch (err) {
        console.log("ERROR", err);
    }
}

execute();