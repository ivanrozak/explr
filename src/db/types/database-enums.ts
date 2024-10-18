export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN"
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const PinType = {
    ACTIVITY: "ACTIVITY",
    PLACE: "PLACE"
} as const;
export type PinType = (typeof PinType)[keyof typeof PinType];
export const CategoryType = {
    THEME: "THEME",
    ACTIVITY: "ACTIVITY"
} as const;
export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];
export const ImageReferenceType = {
    COSTBREAKDOWN: "COSTBREAKDOWN",
    PUBLIC: "PUBLIC",
    INTERESTPOINT: "INTERESTPOINT"
} as const;
export type ImageReferenceType = (typeof ImageReferenceType)[keyof typeof ImageReferenceType];
export const PaymentStatus = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED"
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export const TransactionStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED"
} as const;
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
