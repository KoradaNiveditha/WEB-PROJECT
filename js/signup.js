function validateForm() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    if (!document.getElementById("terms").checked) {
        alert("You must agree to the terms and conditions.");
        return false;
    }

    alert("Signup Successful!");
    return true;
}
