/**
 * Shared registration API function that calls the external authentication API
 */
interface RegisterResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      language: string;
    };
  };
  message: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "seller";
  language: string;
}

export async function callRegisterApi(
  data: RegisterRequest
): Promise<RegisterResponse> {
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
  const registerUrl = `${cleanBaseUrl}/auth/register`;

  console.log("Calling register API:", registerUrl);
  console.log("Registration data:", { ...data, password: "***" });

  const response = await fetch(registerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Get response text first to check if it's JSON
  const responseText = await response.text();
  console.log("Register API response status:", response.status);
  console.log("Register API response text (first 200 chars):", responseText.substring(0, 200));

  let responseData;
  try {
    // Try to parse as JSON
    responseData = JSON.parse(responseText);
  } catch (parseError) {
    // If not JSON, throw error
    console.error("Register API returned non-JSON response:", responseText);
    console.error("Parse error:", parseError);
    throw new Error(
      `Invalid response from registration server: ${responseText.substring(0, 100)}`
    );
  }

  if (!response.ok) {
    throw new Error(
      responseData.message || responseData.error || `Registration failed with status ${response.status}`
    );
  }

  return responseData as RegisterResponse;
}

