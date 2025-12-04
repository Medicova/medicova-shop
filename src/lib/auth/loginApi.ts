/**
 * Shared login API function that calls the external authentication API
 */
export async function callLoginApi(email: string, password: string) {
  // Use BASE_URL from environment, or use NEXTAUTH_URL directly
  let baseUrl = process.env.BASE_URL;
  
  if (!baseUrl && process.env.NEXTAUTH_URL) {
    // Use NEXTAUTH_URL directly - it should already be the API base URL
    // Remove trailing slash if present
    baseUrl = process.env.NEXTAUTH_URL.replace(/\/$/, "");
    
    // If NEXTAUTH_URL doesn't already contain /api/v1, append it
    // This handles cases where NEXTAUTH_URL is just the domain
    if (!baseUrl.includes("/api/v1")) {
      baseUrl = `${baseUrl}/api/v1`;
    }
  }
  
  // Fallback to default external API
  if (!baseUrl) {
    baseUrl = "http://82.112.255.49/api/v1";
  }
  
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const loginUrl = `${cleanBaseUrl}/auth/login`;

  console.log("Calling login API:", loginUrl);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("BASE_URL:", process.env.BASE_URL);

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  // Get response text first to check if it's JSON
  const responseText = await response.text();
  console.log("API response status:", response.status);
  console.log("API response text (first 200 chars):", responseText.substring(0, 200));

  let data;
  try {
    // Try to parse as JSON
    data = JSON.parse(responseText);
  } catch (parseError) {
    // If not JSON, throw error
    console.error("API returned non-JSON response:", responseText);
    console.error("Parse error:", parseError);
    throw new Error(`Invalid response from authentication server: ${responseText.substring(0, 100)}`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `Authentication failed with status ${response.status}`);
  }

  return data;
}

