// Simple test to check that the API_URL constant is defined
describe('API URL Configuration', () => {
  it('should have API_URL defined as a string', () => {
    // Import the app.js file
    const script = document.createElement('script');
    script.src = '../app.js';
    document.body.appendChild(script);

    // Wait for script to load and check the API_URL
    script.onload = () => {
      // Check that API_URL exists and is a string
      expect(typeof API_URL).toBe('string');

      // Check that it's not an empty string
      expect(API_URL.length).toBeGreaterThan(0);
    };
  });
});