async function testLogin() {
    try {
        console.log('Testing login with admin@example.com...');
        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('Login successful!');
            console.log('Token:', data.token);
        } else {
            console.error('Login failed:', data.msg);
        }
    } catch (err) {
        console.error('Test error:', err.message);
    }
}

testLogin();
