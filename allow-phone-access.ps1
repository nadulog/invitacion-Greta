$ErrorActionPreference = 'Stop'
$log = Join-Path $PSScriptRoot 'firewall-result.txt'

try {
    $existing = Get-NetFirewallRule -DisplayName 'Greta Invitacion 8765' -ErrorAction SilentlyContinue
    if ($existing) {
        Set-NetFirewallRule -DisplayName 'Greta Invitacion 8765' -Enabled True -Profile Private -Direction Inbound -Action Allow
    } else {
        New-NetFirewallRule -DisplayName 'Greta Invitacion 8765' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8765 -Profile Private | Out-Null
    }
    'OK: regla creada' | Set-Content -LiteralPath $log
} catch {
    "ERROR: $($_.Exception.Message)" | Set-Content -LiteralPath $log
    exit 1
}
