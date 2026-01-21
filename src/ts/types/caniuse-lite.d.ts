declare module 'caniuse-lite/dist/unpacker' {
    type AgentData = {
        release_date?: Record<string, number>;
        versions?: Array<string | null | undefined>;
    };

    type FeatureData = {
        stats: Record<string, Record<string, string>>;
    };

    export const agents: Record<string, AgentData>;
    export const features: Record<string, unknown>;
    export function feature(data: unknown): FeatureData;
}
