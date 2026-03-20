export function validatePasswordChange(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    if (!data.currentPassword) {
        return "Current password is required";
    }

    if (!data.newPassword) {
        return "New password is required";
    }

    if (data.newPassword.length < 8) {
        return "Password must be at least 8 characters long..";
    }

    if (data.newPassword !== data.confirmPassword) {
        return "New passwords do not match";
    }

    return null; // valid
}