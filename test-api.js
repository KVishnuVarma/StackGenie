// Test script to verify backend API endpoints
// Run this in browser console or as a separate test file

const API_BASE_URL = 'http://localhost:5000/api'

async function testAPI() {
  console.log('Testing StackGenie API...')
  
  // Test 1: Check if backend is running
  try {
    const response = await fetch('http://localhost:5000/')
    const text = await response.text()
    console.log('✅ Backend is running:', text)
  } catch (error) {
    console.error('❌ Backend is not running:', error)
    return
  }
  
  // Test 2: Try to register a test user
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    const registerData = await registerResponse.json()
    console.log('✅ Registration response:', registerData)
    
    if (registerData.token) {
      localStorage.setItem('token', registerData.token)
      console.log('✅ Token stored in localStorage')
      
      // Test 3: Try to get projects
      try {
        const projectsResponse = await fetch(`${API_BASE_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${registerData.token}`,
            'Content-Type': 'application/json',
          }
        })
        
        const projectsData = await projectsResponse.json()
        console.log('✅ Projects response:', projectsData)
      } catch (error) {
        console.error('❌ Projects API error:', error)
      }
    }
  } catch (error) {
    console.error('❌ Registration error:', error)
  }
}

// Run the test
testAPI()
