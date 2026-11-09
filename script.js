
let expression = "";

const result = document.getElementById("result");
const history = document.getElementById("history");

// نمایش اعداد و عملیات
function updateDisplay() {
    result.value = expression || "0";
}

// اضافه کردن دکمه
function append(value) {

    if (expression === "Error") {
        expression = "";
    }

    expression += value;

    updateDisplay();
}

// پاک کردن تمام محاسبات
function clearAll() {
    expression = "";
    history.innerText = "Ready to calculate";
    updateDisplay();
}

// حذف آخرین رقم
function deleteLast() {
    if (expression === "Error") {
        expression = "";
    } else {
        expression = expression.slice(0, -1);
    }

    updateDisplay();
}

// انجام محاسبات
function calculate() {

    try {

        let exp = expression;

        // تبدیل درصد به عدد اعشاری
        exp = exp.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // بررسی کاراکترهای مجاز
        if (!/^[0-9+\-*/().\s]*$/.test(
            exp.replace(/Math\.sqrt/g, "")
        )) {
            throw new Error("Invalid");
        }

        // بررسی پرانتزها

        let balance = 0;

        for (let char of exp) {
            if (char === "(") balance++;
            if (char === ")") balance--;

            if (balance < 0) {
                throw new Error("Invalid");
            }
        }

        if (balance !== 0 || exp.trim() === "") {
            throw new Error("Invalid");
        }

        // محاسبه
        let answer = Function(
            '"use strict"; return (' + exp + ')'
        )();

        if (!Number.isFinite(answer)) {

            throw new Error("Invalid");
        }

        history.innerText = expression + " =";

        // نمایش نتیجه با دقت مناسب
        expression = String(
            Number(answer.toPrecision(12))
        );

        updateDisplay();

    } catch (error) {

        result.value = "Error";
        expression = "Error";
    }
}

// استفاده از کیبورد کمپیوتر
document.addEventListener("keydown", 

function(event) {

    const key = event.key;

    if ("0123456789+-*/().%".includes(key) &&
        key.length === 1) {

        append(key);

    } else if (key === "Enter" || key === "=") {

        event.preventDefault();
        calculate();

    } else if (key === "Backspace") {

        deleteLast();

    } else if (key === "Escape") {

        clearAll();
    }

});
