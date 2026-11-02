const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const appCode = fs.readFileSync(path.join(ROOT_DIR, 'wwwroot', 'js', 'app.js'), 'utf8');

console.log("=== TESTING BOOKING FEATURE IN APP.JS ===");

const checks = [
  { name: "getSiteEmail dynamic helper", check: appCode.includes("function getSiteEmail") },
  { name: "generateReplyTemplate function", check: appCode.includes("function generateReplyTemplate") },
  { name: "sendBookingEmail function", check: appCode.includes("function sendBookingEmail") },
  { name: "linhfromhanam03@gmail.com target", check: appCode.includes("linhfromhanam03@gmail.com") },
  { name: "FormSubmit endpoint", check: appCode.includes("https://formsubmit.co/ajax/") },
  { name: "Quick Book Modal function", check: appCode.includes("function initQuickBookModal") },
  { name: "Quick Book button in tour cards", check: appCode.includes("btn-card-book js-quick-book") },
  { name: "WhatsApp direct chat action", check: appCode.includes("https://wa.me/84902271396") },
  { name: "Zalo chat action", check: appCode.includes("https://zalo.me/0902271396") },
  { name: "Local backup API route /api/book", check: appCode.includes("/api/book") },
  { name: "Dear [Guest Name] template structure", check: appCode.includes("Dear \" + name") && appCode.includes("To complete your tour reservation") }
];

let allPassed = true;
checks.forEach(c => {
  if (c.check) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    allPassed = false;
  }
});

function extractTemplateGen(code) {
  const match = code.match(/function generateReplyTemplate\(data\) \{([\s\S]*?)\n  \}/);
  if (!match) throw new Error("Could not extract generateReplyTemplate");
  const fn = new Function('data', 'getSiteEmail', match[1]);
  return (data) => fn(data, () => "linhfromhanam03@gmail.com");
}

const templateFn = extractTemplateGen(appCode);
const sampleData = {
  name: "John Doe",
  phone: "+1 555 123 4567",
  email: "johndoe@gmail.com",
  tourName: "Tour Du Thuyền 5 Sao Tropical Cruise",
  date: "15/12/2026",
  adults: 2,
  children: 1
};

const sampleOutput = templateFn(sampleData);
console.log("\n--- GENERATED REPLY TEMPLATE SAMPLE ---");
console.log(sampleOutput);

if (!sampleOutput.includes("Dear John Doe,") ||
    !sampleOutput.includes("Tour name: Tour Du Thuyền 5 Sao Tropical Cruise") ||
    !sampleOutput.includes("Number of adults: 2") ||
    !sampleOutput.includes("Email: linhfromhanam03@gmail.com") ||
    !sampleOutput.includes("Number of children (if any): 1")) {
  console.error("Template output missing expected fields!");
  allPassed = false;
}

if (allPassed) {
  console.log("\nALL BOOKING SYSTEM TESTS PASSED 100%!");
} else {
  console.error("\nSome booking system tests failed.");
  process.exit(1);
}
