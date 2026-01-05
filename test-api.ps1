Write-Host "Testing API..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/products" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Success! Status: $($response.StatusCode)"
    Write-Host "Content:"
    $response.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
