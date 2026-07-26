#!/usr/bin/env bash

# Shared path handling for the delegate-development helper scripts.
# Keep this file source-only: callers own shell options and error reporting.

sdd_lower_drive_letter() {
  case "$1" in
    A|a) printf 'a' ;; B|b) printf 'b' ;; C|c) printf 'c' ;;
    D|d) printf 'd' ;; E|e) printf 'e' ;; F|f) printf 'f' ;;
    G|g) printf 'g' ;; H|h) printf 'h' ;; I|i) printf 'i' ;;
    J|j) printf 'j' ;; K|k) printf 'k' ;; L|l) printf 'l' ;;
    M|m) printf 'm' ;; N|n) printf 'n' ;; O|o) printf 'o' ;;
    P|p) printf 'p' ;; Q|q) printf 'q' ;; R|r) printf 'r' ;;
    S|s) printf 's' ;; T|t) printf 't' ;; U|u) printf 'u' ;;
    V|v) printf 'v' ;; W|w) printf 'w' ;; X|x) printf 'x' ;;
    Y|y) printf 'y' ;; Z|z) printf 'z' ;;
    *) return 1 ;;
  esac
}

sdd_normalize_path() {
  local value=$1
  local drive rest normalized

  case "$value" in
    [A-Za-z]:/*|[A-Za-z]:\\*)
      value=${value//\\//}
      if [ -n "${WSL_INTEROP-}" ] || [ -n "${WSL_DISTRO_NAME-}" ]; then
        drive=${value%%:*}
        drive=$(sdd_lower_drive_letter "$drive") || return 1
        rest=${value#?:}
        normalized="/mnt/${drive}${rest}"
      elif case "${MSYSTEM-}:${OSTYPE-}" in
        MINGW*:*|MSYS*:*|CYGWIN*:*|*:msys*|*:cygwin*) true ;;
        *) false ;;
      esac
      then
        if command -v cygpath >/dev/null 2>&1; then
          normalized=$(cygpath -u "$value") || return 1
        else
          drive=${value%%:*}
          drive=$(sdd_lower_drive_letter "$drive") || return 1
          rest=${value#?:}
          normalized="/${drive}${rest}"
        fi
      else
        return 1
      fi
      case "$normalized" in
        /*) printf '%s\n' "$normalized" ;;
        *) return 1 ;;
      esac
      ;;
    *)
      printf '%s\n' "$value"
      ;;
  esac
}

sdd_plan_worktree_root() {
  local plan=$1
  local plan_dir plan_root current_root

  case "$plan" in
    */*)
      plan_dir=${plan%/*}
      [ -n "$plan_dir" ] || plan_dir=/
      ;;
    *)
      plan_dir=.
      ;;
  esac

  plan_root=$(git -C "$plan_dir" rev-parse --show-toplevel 2>/dev/null) || {
    echo "SDD_PLAN_NOT_IN_GIT_WORKTREE: path=$plan" >&2
    return 1
  }
  current_root=$(git rev-parse --show-toplevel 2>/dev/null) || {
    echo "SDD_CURRENT_DIRECTORY_NOT_IN_GIT_WORKTREE" >&2
    return 1
  }

  plan_root=$(sdd_normalize_path "$plan_root") || {
    echo "SDD_PATH_CONVERSION_FAILED: shell=bash path=$plan_root fallback=PowerShell" >&2
    return 1
  }
  current_root=$(sdd_normalize_path "$current_root") || {
    echo "SDD_PATH_CONVERSION_FAILED: shell=bash path=$current_root fallback=PowerShell" >&2
    return 1
  }

  if [ "$plan_root" != "$current_root" ]; then
    echo "SDD_PLAN_WORKTREE_MISMATCH: plan_root=$plan_root current_root=$current_root" >&2
    return 1
  fi

  printf '%s\n' "$current_root"
}

sdd_resolve_command() {
  local name=$1
  local resolved

  if resolved=$(command -v "$name" 2>/dev/null); then
    printf '%s\n' "$resolved"
    return 0
  fi

  if [ -x "/usr/bin/$name" ]; then
    printf '/usr/bin/%s\n' "$name"
    return 0
  fi

  return 1
}
