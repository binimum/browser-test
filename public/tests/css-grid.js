function main() {
    if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
        if (CSS.supports("display", "grid")) {
            return [0, "Test passed."];
        }
        return [2, "Test failed. CSS Grid is not supported."];
    }

    return [4, "Unknown test result. CSS.supports is unavailable."];
}
