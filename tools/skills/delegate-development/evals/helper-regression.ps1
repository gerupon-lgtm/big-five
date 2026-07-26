$ErrorActionPreference = "Stop"

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) {
        throw "ASSERTION_FAILED: $Message"
    }
}

function To-MsysPath {
    param([string]$Path)
    $full = [IO.Path]::GetFullPath($Path).Replace("\", "/")
    if ($full -notmatch "^([A-Za-z]):(/.*)$") {
        throw "Cannot convert path to MSYS form: $full"
    }
    return "/" + $Matches[1].ToLowerInvariant() + $Matches[2]
}

function Invoke-Bash {
    param(
        [string]$Bash,
        [string[]]$Arguments,
        [string]$WorkingDirectory
    )
    Push-Location -LiteralPath $WorkingDirectory
    $previousErrorAction = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        $output = & $Bash "--noprofile" "--norc" @Arguments 2>&1
        $exitCode = $LASTEXITCODE
        return [pscustomobject]@{
            ExitCode = $exitCode
            Output = ($output -join "`n")
        }
    }
    finally {
        $ErrorActionPreference = $previousErrorAction
        Pop-Location
    }
}

$skillRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$bash = "C:\Program Files\Git\bin\bash.exe"
Assert-True (Test-Path -LiteralPath $bash) "Git Bash is required for the Windows regression."

$jp = -join @([char]0x65E5, [char]0x672C, [char]0x8A9E)
$slug = "plan-$jp"
$tempBase = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$tempRoot = Join-Path $tempBase ("delegate-development-$jp-" + [guid]::NewGuid().ToString("N"))
$repo = Join-Path $tempRoot "source"
$worktree = Join-Path $tempRoot "linked worktree"

try {
    New-Item -ItemType Directory -Path (Join-Path $repo "docs") -Force | Out-Null
    @"
# Helper plan

### Task 1: First task

Implement the helper fixture.
"@ | Set-Content -LiteralPath (Join-Path $repo "docs\$slug.md") -Encoding UTF8
    "base`n" | Set-Content -LiteralPath (Join-Path $repo "base.txt") -Encoding UTF8

    git -C $repo init --initial-branch main | Out-Null
    git -C $repo add -- .
    git -C $repo -c user.name=helper-test -c user.email=helper@example.invalid commit -m "base" | Out-Null
    $base = (git -C $repo rev-parse HEAD).Trim()
    git -C $repo worktree add -b helper-test $worktree | Out-Null

    $plan = Join-Path $worktree "docs\$slug.md"
    $planDrivePath = [IO.Path]::GetFullPath($plan).Replace("\", "/")
    $sourcePlanDrivePath = [IO.Path]::GetFullPath((Join-Path $repo "docs\$slug.md")).Replace("\", "/")
    $workspaceScript = [IO.Path]::GetFullPath((Join-Path $skillRoot "scripts\sdd-workspace"))
    $briefScript = [IO.Path]::GetFullPath((Join-Path $skillRoot "scripts\task-brief"))
    $reviewScript = [IO.Path]::GetFullPath((Join-Path $skillRoot "scripts\review-package"))
    $reviewScriptMsys = To-MsysPath $reviewScript

    $workspaceResult = Invoke-Bash -Bash $bash -Arguments @($workspaceScript, $planDrivePath) -WorkingDirectory $worktree
    Assert-True ($workspaceResult.ExitCode -eq 0) "sdd-workspace failed: $($workspaceResult.Output)"
    $workspacePath = ($workspaceResult.Output -split "`n")[-1].Trim()
    Assert-True (($workspacePath -match "^/") -and ($workspacePath -notmatch "^[A-Za-z]:")) "workspace path was not normalized: $workspacePath"
    $workspace = Join-Path $worktree ".superpowers\sdd\$slug"
    Assert-True (Test-Path -LiteralPath $workspace) "workspace was not created in the linked worktree."
    Assert-True (-not (Test-Path -LiteralPath (Join-Path $worktree "C:"))) "an erroneous C: directory was created."

    $mismatchResult = Invoke-Bash -Bash $bash -Arguments @($workspaceScript, $sourcePlanDrivePath) -WorkingDirectory $worktree
    Assert-True (($mismatchResult.ExitCode -ne 0) -and ($mismatchResult.Output -match "SDD_PLAN_WORKTREE_MISMATCH")) "a plan from another worktree was not rejected."

    $briefResult = Invoke-Bash -Bash $bash -Arguments @($briefScript, $planDrivePath, "1") -WorkingDirectory $worktree
    Assert-True ($briefResult.ExitCode -eq 0) "task-brief failed: $($briefResult.Output)"
    Assert-True (Test-Path -LiteralPath (Join-Path $workspace "task-1-brief.md")) "task brief was not created."
    $badTaskResult = Invoke-Bash -Bash $bash -Arguments @($briefScript, $planDrivePath, "x") -WorkingDirectory $worktree
    Assert-True (($badTaskResult.ExitCode -ne 0) -and ($badTaskResult.Output -match "SDD_INVALID_TASK_NUMBER")) "a non-numeric task number was not rejected: exit=$($badTaskResult.ExitCode) output=$($badTaskResult.Output)"

    "changed`n" | Set-Content -LiteralPath (Join-Path $worktree "result.txt") -Encoding UTF8
    git -C $worktree add -- result.txt
    git -C $worktree -c user.name=helper-test -c user.email=helper@example.invalid commit -m "change" | Out-Null
    $head = (git -C $worktree rev-parse HEAD).Trim()

    $defaultReview = Invoke-Bash -Bash $bash -Arguments @($reviewScript, $planDrivePath, $base, $head) -WorkingDirectory $worktree
    Assert-True ($defaultReview.ExitCode -eq 0) "default review-package failed: $($defaultReview.Output)"
    $reviewFiles = @(Get-ChildItem -LiteralPath $workspace -Filter "review-*.diff")
    Assert-True ($reviewFiles.Count -eq 1 -and $reviewFiles[0].Length -gt 0) "default review package is missing or empty."
    $emptyReview = Invoke-Bash -Bash $bash -Arguments @($reviewScript, $planDrivePath, $head, $head) -WorkingDirectory $worktree
    Assert-True (($emptyReview.ExitCode -ne 0) -and ($emptyReview.Output -match "REVIEW_PACKAGE_EMPTY_RANGE")) "an empty review range was not rejected."

    $shim = Join-Path $tempRoot "minimal-path"
    New-Item -ItemType Directory -Path $shim | Out-Null
    $shimPath = Join-Path $shim "git"
    $bashShimPath = Join-Path $shim "bash"
    $runnerPath = Join-Path $tempRoot "minimal-runner"
    $posixCheckPath = Join-Path $tempRoot "posix-check"
    $utf8NoBom = New-Object Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($shimPath, "#!/bin/bash`nexec /mingw64/bin/git.exe `"`$@`"`n", $utf8NoBom)
    [IO.File]::WriteAllText($bashShimPath, "#!/bin/bash`nexec /bin/bash `"`$@`"`n", $utf8NoBom)
    [IO.File]::WriteAllText($runnerPath, "#!/bin/bash`nPATH=`"`$1`"`nshift`nexec /bin/bash `"`$@`"`n", $utf8NoBom)
    [IO.File]::WriteAllText($posixCheckPath, "#!/bin/bash`n. `"`$1`"`ntest `"`$(sdd_normalize_path /tmp/example)`" = /tmp/example`ntest `"`$(WSL_INTEROP=1 MSYSTEM= sdd_normalize_path C:/example)`" = /mnt/c/example`n", $utf8NoBom)
    $shimMsys = To-MsysPath $shim
    $shimGit = "$shimMsys/git"
    $shimBash = "$shimMsys/bash"
    $runnerMsys = To-MsysPath $runnerPath
    $posixCheckMsys = To-MsysPath $posixCheckPath
    $chmodResult = Invoke-Bash -Bash $bash -Arguments @("-c", "chmod +x `"$shimGit`" `"$shimBash`" `"$runnerMsys`" `"$posixCheckMsys`"") -WorkingDirectory $worktree
    Assert-True ($chmodResult.ExitCode -eq 0) "could not prepare minimal PATH shim."

    $explicitOutput = Join-Path $tempRoot "explicit-review.diff"
    $explicitOutputDrivePath = [IO.Path]::GetFullPath($explicitOutput).Replace("\", "/")
    $minimalReview = Invoke-Bash -Bash $bash -Arguments @(
        $runnerMsys, $shimMsys, $reviewScriptMsys, $planDrivePath, $base, $head, $explicitOutputDrivePath
    ) -WorkingDirectory $worktree
    Assert-True ($minimalReview.ExitCode -eq 0) "minimal-PATH review-package failed: $($minimalReview.Output)"
    Assert-True ((Test-Path -LiteralPath $explicitOutput) -and (Get-Item -LiteralPath $explicitOutput).Length -gt 0) "explicit review package is missing or empty."
    Assert-True ($minimalReview.Output -notmatch "command not found|,\s+bytes") "minimal-PATH output contains an incomplete success message."
    Assert-True ($minimalReview.Output -match "REVIEW_PACKAGE_BYTE_COUNT_UNAVAILABLE") "missing byte-count warning was not explicit."

    $commonScript = To-MsysPath (Join-Path $skillRoot "scripts\sdd-common.sh")
    $posixCheck = Invoke-Bash -Bash $bash -Arguments @($posixCheckMsys, $commonScript) -WorkingDirectory $worktree
    Assert-True ($posixCheck.ExitCode -eq 0) "POSIX path behavior regressed."

    Write-Output "delegate-development helper regression passed"
}
finally {
    if (Test-Path -LiteralPath $tempRoot) {
        $resolved = [IO.Path]::GetFullPath($tempRoot)
        Assert-True ($resolved.StartsWith($tempBase, [StringComparison]::OrdinalIgnoreCase)) "refusing cleanup outside the temp directory."
        Assert-True ((Split-Path -Leaf $resolved).StartsWith("delegate-development-$jp-", [StringComparison]::Ordinal)) "refusing cleanup of an unexpected directory."
        Remove-Item -LiteralPath $resolved -Recurse -Force
    }
}
