export const toastErrorStyle = "border-2 border-red-500";
export const toastSuccessStyle = "border-2 border-green-500";
export const toastWarningStyle = "border-2 border-yellow-500";

export const toastDefaultStyle = (color: string) => {
    if (color === "default") {
        return "";
    }

    return `border border-${color}-500`;
};