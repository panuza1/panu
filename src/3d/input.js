// Shared input state — written by both keyboard and mobile touch buttons
export const input = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
};

export const isTouchDevice = () =>
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);
