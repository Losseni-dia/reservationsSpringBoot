/** API examples (English) — header name and URLs are technical constants. */
export const HIGHLIGHT_X_API_KEY_JS = "'X-API-KEY': 'sk_YOUR_SECRET_KEY_HERE'";
export const HIGHLIGHT_X_API_KEY_CURL = '"X-API-KEY: sk_YOUR_SECRET_KEY_HERE"';
export const HIGHLIGHT_X_API_KEY_PHP = '"X-API-KEY: sk_YOUR_SECRET_KEY_HERE\\r\\n"';
export const HIGHLIGHT_X_API_KEY_PYTHON = '"X-API-KEY": "sk_YOUR_SECRET_KEY_HERE"';

export const codeExampleJs = `// 1. Set the URL you want to call
const apiUrl = 'http://localhost:8080/api/public/shows';

// 2. Run the request and add the header
fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
`;

export const codeExampleJsAfter = `
    }
})
.then(res => res.json())
.then(data => console.log("Shows:", data))
.catch(err => console.error("Error:", err));`;

export const codeExampleCurlBefore = `# Paste this in your terminal (Bash / PowerShell)
curl -X GET "http://localhost:8080/api/public/shows" \\
     -H "Accept: application/json" \\
     -H `;

export const codeExamplePhpBefore = `<?php
$url = "http://localhost:8080/api/public/shows";

$options = [
    "http" => [
        "header" => `;

export const codeExamplePhpAfter = `
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

$shows = json_decode($response, true);
print_r($shows);
?>`;

export const codeExamplePythonBefore = `import requests

url = "http://localhost:8080/api/public/shows"
headers = {
    `;

export const codeExamplePythonAfter = `
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Data:", response.json())
else:
    print("Error:", response.status_code)`;
