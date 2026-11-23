
const input = document.getElementById("temperatureInput");
const fromUnit = document.getElementById("fromUnit");
const inputSymbol = document.getElementById("inputSymbol");

const celsiusValue = document.getElementById("celsiusValue");
const fahrenheitValue = document.getElementById("fahrenheitValue");
const kelvinValue = document.getElementById("kelvinValue");

const errorMessage = document.getElementById("errorMessage");
const thermalIcon = document.getElementById("thermalIcon");
const thermalTitle = document.getElementById("thermalTitle");
const thermalDescription = document.getElementById("thermalDescription");
const thermalReading = document.getElementById("thermalReading");

const visualTitle = document.getElementById("visualTitle");
const visualDescription = document.getElementById("visualDescription");
const visualCelsius = document.getElementById("visualCelsius");
const thermoFill = document.getElementById("thermoFill");

const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

let latestReadings = null;
let history = [];

try {
    history = JSON.parse(localStorage.getItem("thermoraHistory")) || [];
} catch {
    history = [];
}

// Convert any temperature into Celsius
function toCelsius(value, unit) {
    if (unit === "C") return value;
    if (unit === "F") return (value - 32) * 5 / 9;
    return value - 273.15;
}

// Convert Celsius into the required scale
function fromCelsius(value, unit) {
    if (unit === "C") return value;
    if (unit === "F") return (value * 9 / 5) + 32;
    return value + 273.15;
}

function symbol(unit) {
    return unit === "C" ? "°C" : unit === "F" ? "°F" : "K";
}

function format(value) {
    return Number(value.toFixed(2)).toFixed(2);
}

// Describe the current temperature
function getThermalCondition(celsius) {
    if (celsius <= 0) {
        return {
            icon: "❄",
            title: "Freezing conditions",
            description: "At or below the freezing point of water.",
            visualTitle: "A world of ice.",
            visualDescription: "This reading is at or below water's freezing point."
        };
    }

    if (celsius < 15) {
        return {
            icon: "❄",
            title: "Cool atmosphere",
            description: "A noticeably cool temperature.",
            visualTitle: "A cool atmosphere.",
            visualDescription: "A refreshing temperature on the cooler side."
        };
    }

    if (celsius < 28) {
        return {
            icon: "☀",
            title: "Comfort zone",
            description: "A pleasant range around typical room temperature.",
            visualTitle: "A balanced atmosphere.",
            visualDescription: "Your reading sits in a comfortable range."
        };
    }

    if (celsius < 40) {
        return {
            icon: "♨",
            title: "Warm conditions",
            description: "The temperature is getting noticeably warm.",
            visualTitle: "The warmth is rising.",
            visualDescription: "A warmer reading. Stay comfortable and hydrated."
        };
    }

    return {
        icon: "☀",
        title: "High temperature",
        description: "A hot reading. Take care in the heat.",
        visualTitle: "Heat is in the air.",
        visualDescription: "This is a high temperature reading."
    };
}

// Main display function
function updateTemperature(saveToHistory = false) {
    const rawValue = input.value.trim();
    const value = Number(rawValue);
    const unit = fromUnit.value;

    errorMessage.textContent = "";

    if (rawValue === "" || !Number.isFinite(value)) {
        showError("Please enter a valid temperature.");
        return;
    }

    const celsius = toCelsius(value, unit);

    if (celsius < -273.15) {
        showError("Temperature cannot be below absolute zero (−273.15°C).");
        return;
    }

    const fahrenheit = fromCelsius(celsius, "F");
    const kelvin = fromCelsius(celsius, "K");

    latestReadings = {
        celsius,
        fahrenheit,
        kelvin,
        input: value,
        inputUnit: unit
    };

    celsiusValue.textContent = format(celsius);
    fahrenheitValue.textContent = format(fahrenheit);
    kelvinValue.textContent = format(kelvin);

    const condition = getThermalCondition(celsius);

    thermalIcon.textContent = condition.icon;
    thermalTitle.textContent = condition.title;
    thermalDescription.textContent = condition.description;
    thermalReading.textContent = `${format(celsius)}°`;

    visualTitle.textContent = condition.visualTitle;
    visualDescription.textContent = condition.visualDescription;
    visualCelsius.textContent = format(celsius);

    // Map the reading to a visual thermometer level
    const level = Math.max(3, Math.min(100, ((celsius + 50) / 150) * 100));
    thermoFill.style.height = `${level}%`;

    if (saveToHistory) {
        addHistory();
    }
}

function showError(message) {
    errorMessage.textContent = message;
    latestReadings = null;

    celsiusValue.textContent = "--";
    fahrenheitValue.textContent = "--";
    kelvinValue.textContent = "--";

    thermalIcon.textContent = "!";
    thermalTitle.textContent = "Check your input";
    thermalDescription.textContent = "A valid temperature is required.";
    thermalReading.textContent = "--";

    visualTitle.textContent = "Waiting for a reading.";
    visualDescription.textContent = "Enter a valid temperature to explore its thermal profile.";
    visualCelsius.textContent = "--";
    thermoFill.style.height = "0%";
}

// Save recent conversions
function addHistory() {
    if (!latestReadings) return;

    const { input: value, inputUnit, celsius, fahrenheit, kelvin } = latestReadings;

    history.unshift({
        input: `${format(value)} ${symbol(inputUnit)}`,
        output: `${format(celsius)} °C`,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    history = history.slice(0, 8);

    try {
        localStorage.setItem("thermoraHistory", JSON.stringify(history));
    } catch {
        // History still works for the current session.
    }

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-history";
        empty.textContent = "Your recent conversions will appear here.";
        historyList.appendChild(empty);
        return;
    }

    history.forEach(item => {
        const row = document.createElement("div");
        row.className = "history-row";

        const inputCell = document.createElement("span");
        inputCell.textContent = item.input;

        const outputCell = document.createElement("span");
        outputCell.textContent = "Celsius";

        const resultCell = document.createElement("strong");
        resultCell.textContent = item.output;

        const timeCell = document.createElement("time");
        timeCell.textContent = item.time;

        row.append(inputCell, outputCell, resultCell, timeCell);
        historyList.appendChild(row);
    });
}

// Live conversion
input.addEventListener("input", () => updateTemperature(false));
fromUnit.addEventListener("change", () => {
    inputSymbol.textContent = symbol(fromUnit.value);
    updateTemperature(false);
});

// Record a conversion when button-like interaction is made
document.getElementById("copyButton").addEventListener("click", async () => {
    updateTemperature(true);

    if (!latestReadings) return;

    const { celsius, fahrenheit, kelvin } = latestReadings;

    const text = [
        `Celsius: ${format(celsius)} °C`,
        `Fahrenheit: ${format(fahrenheit)} °F`,
        `Kelvin: ${format(kelvin)} K`
    ].join("\n");

    try {
        await navigator.clipboard.writeText(text);
        document.getElementById("copyButton").textContent = "COPIED ✓";
        setTimeout(() => {
            document.getElementById("copyButton").textContent = "COPY ALL READINGS ↗";
        }, 1600);
    } catch {
        errorMessage.textContent = "Clipboard access is unavailable in this browser.";
    }
});

// Swap to the next scale while preserving the same temperature
document.getElementById("swapButton").addEventListener("click", () => {
    if (!latestReadings) return;

    const currentUnit = fromUnit.value;
    const nextUnit = currentUnit === "C" ? "F" : currentUnit === "F" ? "K" : "C";

    const celsius = latestReadings.celsius;
    const nextValue = fromCelsius(celsius, nextUnit);

    fromUnit.value = nextUnit;
    input.value = format(nextValue);
    inputSymbol.textContent = symbol(nextUnit);

    updateTemperature(false);
});

// Reset the converter
document.getElementById("resetButton").addEventListener("click", () => {
    input.value = "";
    fromUnit.value = "C";
    inputSymbol.textContent = "°C";
    updateTemperature(false);
    input.focus();
});

// Quick presets
document.querySelectorAll(".preset").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".preset").forEach(item => item.classList.remove("active"));

        button.classList.add("active");
        input.value = button.dataset.value;
        fromUnit.value = button.dataset.unit;
        inputSymbol.textContent = symbol(button.dataset.unit);

        updateTemperature(true);
    });
});

// Clear history
document.getElementById("clearHistory").addEventListener("click", () => {
    history = [];

    try {
        localStorage.removeItem("thermoraHistory");
    } catch {
        // Ignore unavailable local storage.
    }

    renderHistory();
});

// Dark and light theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.textContent = isDark ? "☀" : "☾";

    try {
        localStorage.setItem("thermoraTheme", isDark ? "dark" : "light");
    } catch {
        // Theme still works for the current session.
    }
});

// Restore saved theme
try {
    if (localStorage.getItem("thermoraTheme") === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.textContent = "☀";
    }
} catch {
    // Use the default light theme.
}

// Initial display
renderHistory();
updateTemperature(false);


