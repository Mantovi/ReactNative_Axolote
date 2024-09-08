export const validateColor = (color: string): "Albino" | "Pimentinha" | "Uranio" => {
    const validColors = ["Albino", "Pimentinha", "Uranio"] as const;
    if (validColors.includes(color as any)) {
        return color as "Albino" | "Pimentinha" | "Uranio";
    }
    throw new Error("Invalid color");
};
