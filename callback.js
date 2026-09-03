function validate(id, password, callback) {

    if (id === "Muskan" && password === "muskan123") {
        callback(true);
    } else {
        callback(false);
    }
}

function loginResult(isValid) {
    if (isValid) {
        console.log("Login successful");
    } else {
        console.log("Invalid ID or password");
    }
}

validate("Muskan", "muskan123", loginResult);