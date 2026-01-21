export type TestResult = {
    code: number;
    message: string;
    details?: string;
};

export type BrowserTest = {
    name: string;
    points: number;
    run: () => TestResult;
    spec: {
        title: string;
        url: string;
    };
    caniuseFeature: string;
};
