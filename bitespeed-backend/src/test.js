const BASE_URL = 'http://localhost:3000/identify';
async function testIdentify(payload, description) {
    console.log(`\nTesting: ${description}`);
    console.log(`Payload: ${JSON.stringify(payload)}`);
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data, null, 2)}`);
        return data;
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
async function runTests() {
    // Test 1: New Primary
    await testIdentify({ email: "mcfly@hillvalley.edu", phoneNumber: "123456" }, "First purchase by Marty McFly");
    // Test 2: New Secondary (same phone, new email)
    await testIdentify({ email: "lorraine@hillvalley.edu", phoneNumber: "123456" }, "Secondary contact linking (Lorraine using Marty's phone)");
    // Test 3: Existing Primary (exact match)
    await testIdentify({ email: "mcfly@hillvalley.edu", phoneNumber: "123456" }, "Existing contact (Exact match)");
    // Test 4: Another New Primary
    await testIdentify({ email: "biff@tannen.com", phoneNumber: "999999" }, "Another new primary (Biff Tannen)");
    // Test 5: Linking two primaries
    await testIdentify({ email: "mcfly@hillvalley.edu", phoneNumber: "999999" }, "Linking two primaries (Marty using Biff's phone)");
}
runTests();
export {};
