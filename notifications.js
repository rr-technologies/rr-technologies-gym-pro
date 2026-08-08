// =======================================
// RR Technologies Gym Pro
// Notifications JS
// =======================================

// Load Notifications

let currentTestDate = new Date();

function formatDate(dateString) {

    if (!dateString) return "";

    let day, month, year;

    // DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {

        const parts = dateString.split("-");

        day = parts[0];
        month = parts[1];
        year = parts[2];

    }
    // YYYY-MM-DD
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

        const parts = dateString.split("-");

        year = parts[0];
        month = parts[1];
        day = parts[2];

    }
    else {
        return dateString;
    }

    return `${day}-${month}-${year}`;
}


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

    const today = currentTestDate ? new Date(currentTestDate) : new Date();
    today.setHours(0, 0, 0, 0);

    const parts = expiryDate.split("-");

let expiry;

if (parts[0].length === 4) {
    // YYYY-MM-DD
    expiry = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
} else {
    // DD-MM-YYYY
    expiry = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
    );
}

expiry.setHours(0, 0, 0, 0);

    const diff = expiry.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));

}

// ==========================================
// WhatsApp Reminder
// ==========================================

function openWhatsAppApp(memberId, days) {

    const members = getMembers();

    const member = members.find(m => m.memberId === memberId);

    if (!member) {
        alert("Member details not found.");
        return;
    }

    let mobile = member.mobile || member.mobileNumber || "";

    if (!mobile) {
        alert("Mobile number not available for this member.");
        return;
    }

    // Remove spaces and special characters
    mobile = mobile.replace(/\D/g, "");

    // Add India country code
    if (mobile.length === 10) {
        mobile = "91" + mobile;
    }

    const name = member.name || member.fullName || "Member";

    let message = "";

if (days === 7) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership will expire in 7 days.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 6) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership will expire in 6 days.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 5) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership will expire in 5 days.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 4) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership will expire in 4 days.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 3) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership will expire in 3 days.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 2) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership will expire in 2 days.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 1) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership expires tomorrow.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

if (days === 0) {
    message =
        `Hello ${name},\n\n` +
        `This is a reminder from RR Technologies Gym.\n` +
        `Your gym membership has expired.\n` +
        `Expiry Date: ${formatDate(member.expiryDate)}\n\n` +
        `Please renew your membership to continue your workouts.\n\n` +
        `Thank you.`;
}

    const whatsappURL =
        `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}


function loadNotifications(){

    const members = getMembers();

    const selectedDate = new Date(currentTestDate);
selectedDate.setHours(0, 0, 0, 0);

 let expiring7 = 0;
let expiring6 = 0;
let expiring5 = 0;
let expiring4 = 0;
let expiring3 = 0;
let expiring2 = 0;
let tomorrow = 0;
let expired = 0;

let list7HTML = "";
let list6HTML = "";
let list5HTML = "";
let list4HTML = "";
let list3HTML = "";
let list2HTML = "";
let listTomorrowHTML = "";
let listExpiredHTML = "";

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

    console.log("Adding :", member.memberId, member.name);

    list7HTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 7)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days === 6) {

    expiring6++;

    list6HTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 6)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days === 5) {

    expiring5++;

    list5HTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 5)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days === 4) {

    expiring4++;

    list4HTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 4)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days === 3) {

    expiring3++;

    list3HTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 3)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days === 2) {

    expiring2++;

    list2HTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 2)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days === 1) {

    tomorrow++;

    listTomorrowHTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 1)">
    📱 WhatsApp
</button>

        </div>
    `;

}
else if (days < 0) {

    expired++;

    listExpiredHTML += `
        <div class="member-card">
            <h4>${member.memberId} - ${member.name}</h4>
            <p>Mobile : ${member.mobile}</p>
            <p>Expiry : ${formatDate(member.expiryDate)}</p>
<button class="whatsapp-btn" onclick="openWhatsAppApp('${member.memberId}', 0)">
    📱 WhatsApp
</button>

        </div>
    `;

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

document.getElementById("badge7").textContent = expiring7;
document.getElementById("badge6").textContent = expiring6;
document.getElementById("badge5").textContent = expiring5;
document.getElementById("badge4").textContent = expiring4;
document.getElementById("badge3").textContent = expiring3;
document.getElementById("badge2").textContent = expiring2;
document.getElementById("badgeTomorrow").textContent = tomorrow;
document.getElementById("badgeExpired").textContent = expired;

document.getElementById("list7Days").innerHTML = list7HTML;
document.getElementById("list6Days").innerHTML = list6HTML;
document.getElementById("list5Days").innerHTML = list5HTML;
document.getElementById("list4Days").innerHTML = list4HTML;
document.getElementById("list3Days").innerHTML = list3HTML;
document.getElementById("list2Days").innerHTML = list2HTML;
document.getElementById("listTomorrow").innerHTML = listTomorrowHTML;
document.getElementById("listExpired").innerHTML = listExpiredHTML;

}