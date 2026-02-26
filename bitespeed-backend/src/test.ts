import axios from 'axios';

const BASE_URL = 'http://localhost:3000/identify';

async function testIdentify(payload: any, description: string) {
    console.log(`\nTesting: ${description}`);
    console.log(`Payload: ${JSON.stringify(payload)}`);

    try {
        const response = await axios.post(BASE_URL, payload);
        const data = response.data;
        console.log(`Response: ${JSON.stringify(data, null, 2)}`);
        return data;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Data: ${JSON.stringify(error.response.data)}`);
        }
    }
}

async function runTests() {
    // Test 1: New Primary
    await testIdentify(
        { email: "mcfly@hillvalley.edu", phoneNumber: "123456" },
        "First purchase by Marty McFly"
    );

    // Test 2: New Secondary (same phone, new email)
    await testIdentify(
        { email: "lorraine@hillvalley.edu", phoneNumber: "123456" },
        "Secondary contact linking (Lorraine using Marty's phone)"
    );

    // Test 3: Existing Primary (exact match)
    await testIdentify(
        { email: "mcfly@hillvalley.edu", phoneNumber: "123456" },
        "Existing contact (Exact match)"
    );

    // Test 4: Another New Primary
    await testIdentify(
        { email: "biff@tannen.com", phoneNumber: "999999" },
        "Another new primary (Biff Tannen)"
    );

    // Test 5: Linking two primaries
    await testIdentify(
        { email: "mcfly@hillvalley.edu", phoneNumber: "999999" },
        "Linking two primaries (Marty using Biff's phone)"
    );
}

runTests();
