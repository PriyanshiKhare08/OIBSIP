function convertTemperature() {
    const temperature = parseFloat(
        document.getElementById("temperature").value
    );

    const fromUnit = document.getElementById("fromUnit").value;
    const toUnit = document.getElementById("toUnit").value;
    const result = document.getElementById("result");

    if (document.getElementById("temperature").value.trim() === "") {
        result.innerText = "Please enter a temperature!";
        return;
    }

    if (temperature < 0 && fromUnit === "Kelvin") {
        result.innerText = "Kelvin cannot be negative!";
        return;
    }

    let celsius;

    // Convert input into Celsius
    if (fromUnit === "Celsius") {
        celsius = temperature;
    } else if (fromUnit === "Fahrenheit") {
        celsius = (temperature - 32) * 5 / 9;
    } else {
        celsius = temperature - 273.15;
    }

    let converted;

    // Convert Celsius into target unit
    if (toUnit === "Celsius") {
        converted = celsius;
    } else if (toUnit === "Fahrenheit") {
        converted = (celsius * 9 / 5) + 32;
    } else {
        converted = celsius + 273.15;
    }

    result.innerText = converted.toFixed(2) + " " + toUnit;
}