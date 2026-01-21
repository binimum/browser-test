function main() {
    if ("serviceWorker" in navigator) {
        return [0, "Test passed."];
    }

    return [2, "Test failed. Service workers are not supported."];
}
