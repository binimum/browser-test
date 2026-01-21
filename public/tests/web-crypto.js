function main() {
    if (typeof crypto === "undefined") {
        return [2, "Test failed. crypto is undefined."];
    }

    if (crypto.subtle && typeof crypto.subtle.digest === "function") {
        return [0, "Test passed."];
    }

    return [1, "Test partially passed. crypto is available but SubtleCrypto is missing."];
}
