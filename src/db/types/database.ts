import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { UserRole, PinType, CategoryType, ImageReferenceType, PaymentStatus, TransactionStatus } from "./database-enums";

export type AnonymousUser = {
    id: string;
    created_at: Generated<Timestamp>;
};
export type Board = {
    id: Generated<number>;
    name: string;
    user_id: string | null;
    anonymous_id: string | null;
    original_id: number | null;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type BoardPin = {
    id: Generated<number>;
    board_id: number;
    pin_id: number;
    created_at: Generated<Timestamp>;
};
export type Category = {
    id: Generated<number>;
    name: string;
    description: string | null;
    image_url: string;
    type: Generated<CategoryType>;
    createdAt: Generated<Timestamp | null>;
    updatedAt: Timestamp | null;
};
export type CategoryToPin = {
    A: number;
    B: number;
};
export type CostBreakdown = {
    id: Generated<number>;
    image_url: string | null;
    name: string | null;
    content: string | null;
    order_id: number | null;
    itinerary_id: number;
};
export type ImageReference = {
    id: Generated<number>;
    image_url: string;
    type: Generated<ImageReferenceType>;
};
export type Itinerary = {
    id: Generated<number>;
    name: string;
    description: string | null;
    total_recommended_time: string | null;
    total_cost: string | null;
    price: number | null;
    is_published: Generated<boolean | null>;
    user_id: string;
    board_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp | null;
};
export type ItineraryBreakdown = {
    id: Generated<number>;
    itinerary_detail_id: number;
    cost: number;
    time: number;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp | null;
};
export type ItineraryDetail = {
    id: Generated<number>;
    name: string;
    description: string | null;
    image_url: string | null;
    order_id: number | null;
    activity_duration: number | null;
    duration_unit: string | null;
    pin_type: string | null;
    activity: string | null;
    estimated_time: string | null;
    estimated_distance: string | null;
    estimated_cost: string | null;
    place_name: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    pin_id: number | null;
    tags: string[];
    itinerary_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp | null;
};
export type Like = {
    id: Generated<number>;
    user_id: string | null;
    anonymous_id: string | null;
    pin_id: number;
    board_id: number;
    created_at: Generated<Timestamp>;
};
export type Payment = {
    id: Generated<string>;
    stripe_payment_id: string;
    status: PaymentStatus;
    transaction_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
};
export type Pin = {
    id: Generated<number>;
    title: string;
    description: string | null;
    image_url: string;
    link: string;
    place_name: string;
    address: string | null;
    latitude: number;
    longitude: number;
    activity_duration: number | null;
    duration_unit: string | null;
    pin_type: Generated<PinType>;
    created_at: Generated<Timestamp | null>;
    updated_at: Timestamp | null;
    user_id: string;
    total_like: Generated<number | null>;
};
export type PinToTag = {
    A: number;
    B: number;
};
export type Tag = {
    id: Generated<number>;
    name: string;
    created_at: Generated<Timestamp>;
};
export type Transaction = {
    id: Generated<string>;
    amount: number;
    status: Generated<TransactionStatus>;
    user_id: string;
    board_id: number | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: Generated<string>;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    picture: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    role: Generated<UserRole>;
};
export type UserSession = {
    id: string;
    expires_at: Timestamp;
    user_id: string;
};
export type DB = {
    _CategoryToPin: CategoryToPin;
    _PinToTag: PinToTag;
    AnonymousUser: AnonymousUser;
    Board: Board;
    BoardPin: BoardPin;
    Category: Category;
    CostBreakdown: CostBreakdown;
    ImageReference: ImageReference;
    Itinerary: Itinerary;
    ItineraryBreakdown: ItineraryBreakdown;
    ItineraryDetail: ItineraryDetail;
    Like: Like;
    Payment: Payment;
    Pin: Pin;
    Tag: Tag;
    Transaction: Transaction;
    User: User;
    UserSession: UserSession;
};
