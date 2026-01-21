function main() {
    if (typeof fetch === "function") {
        return [0, "Test passed."];
    }

    return [2, "Test failed. fetch is not available."];
}
