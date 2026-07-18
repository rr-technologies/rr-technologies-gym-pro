// =======================================
// RR Technologies Gym Pro
// Notifications JS
// =======================================

// Load Notifications

let currentTestDate = new Date();


document.addEventListener("DOMContentLoaded", () => {

    loadGymBranding();
    updateGreeting();
    initAccordion();
    loadNotifications();

    const useTodayCheckbox = document.getElementById("useTodayDate");
    const testDateInput = document.getElementById("testDate");
    const applyBtn = document.getElementById("applyTestDate");

    if (useTodayCheckbox && testDateInput) {

        useTodayCheckbox.addEventListener("change", function () {

            if (this.checked) {
                testDateInput.value = new Date().toISOString().split("T")[0];
                testDateInput.disabled = true;
            } else {
                testDateInput.disabled = false;
            }

        });

    }

    if (applyBtn) {

        applyBtn.addEventListener("click", function () {

            currentTestDate = testDateInput.value;
            loadNotifications();

        });

    }

});

// =======================================
// Gym Branding
// =======================================

function loadGymBranding(){

    const settings = getGymSettings();

    const logo = document.getElementById("dashboardLogo");

    const gymName = document.getElementById("notificationGymName");

    if(settings){

        if(settings.logo && logo){

            logo.src = settings.logo;

        }

        if(settings.gymName && gymName){

            gymName.textContent = settings.gymName;

        }

    }

}

// =======================================
// Greeting
// =======================================

function updateGreeting(){

    function updateClock(){

        const greeting = document.getElementById("greetingText");
        const dateTime = document.getElementById("dateTimeText");

        const now = new Date();

        const hour = now.getHours();

        let text = "Good Evening";

        if(hour < 12){
            text = "Good Morning";
        }else if(hour < 17){
            text = "Good Afternoon";
        }

        greeting.innerHTML = "👋 " + text;

        const date = now.toLocaleDateString("en-IN",{
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        });

        const time = now.toLocaleTimeString("en-IN",{
            hour:"2-digit",
            minute:"2-digit",
            hour12:true
        }).toUpperCase();

        dateTime.innerHTML = `${date} • ${time}`;
    }

    updateClock();

    setInterval(updateClock,1000);

}

// =======================================
// Accordion
// =======================================

function initAccordion(){

    const items = document.querySelectorAll(".accordion");

    items.forEach(item=>{

        const header = item.querySelector(".accordion-header");

        header.addEventListener("click",()=>{

            item.classList.toggle("active");

        });

    });

}

// =======================================
// Calculate Remaining Days
// =======================================

function getRemainingDays(expiryDate) {

    if (!expiryDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diff = expiry.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));

}

// =======================================
// Load Notifications
// =======================================

function loadNotifications(){

    const members = getMembers();

    const selectedDate = new Date(currentTestDate);
selectedDate.setHours(0, 0, 0, 0);

    let expiring7 = 0;
let expiring3 = 0;
let tomorrow = 0;
let expired = 0;

    console.log("Total Members :", members.length);

    members.forEach(member => {

        // Test Date Alert
if (member.testDate) {

    const testDate = new Date(member.testDate);
    testDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
        (testDate - selectedDate) / (1000 * 60 * 60 * 24)
    );

    console.log(
        member.name,
        "Test Date:",
        member.testDate,
        "Difference:",
        diffDays
    );

if (diffDays === 2) {
    tomorrow++;
}

if (diffDays === 0) {
    expiring3++;
}

}

    console.log(
    member.memberId,
    member.name,
    "Test Date:",
    member.testDate
);

        const days = getRemainingDays(member.expiryDate);

        if (days === 7) {

    expiring7++;

}
else if (days === 3) {

    expiring3++;

}
else if (days === 1) {

    tomorrow++;

}
else if (days < 0) {

    expired++;

}

        console.log(
            member.memberId,
            member.name,
            member.expiryDate,
            "Remaining Days :", days
        );

    });

    console.log("7 Days :", expiring7);
console.log("3 Days :", expiring3);
console.log("Tomorrow :", tomorrow);
console.log("Expired :", expired);

document.getElementById("count7Days").textContent = expiring7;
document.getElementById("count3Days").textContent = expiring3;
document.getElementById("countTomorrow").textContent = tomorrow;
document.getElementById("countExpired").textContent = expired;

}