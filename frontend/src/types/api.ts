export interface PageResponse<T> {
    content: T[],
    number: number,
    size: number,
    totalElements: number,
    totalPages: number,
    first: boolean,
    last: boolean
}

export interface ParkingSlotResponse {
    id: number,
    slotNumber: number,
    location: string
}

export interface ApartmentResidentResponse {
    apartmentId: number,
    residentId: number,
    roleType: string
}

export interface ApartmentResponse {
    id: number,
    code: string,
    tower: string,
    balance: number,
    sqm: number,
    aliquot: number,
    parkingSlots: ParkingSlotResponse[],
    apartmentResidents: ApartmentResidentResponse[]
}

export interface ResidentResponse {
    id: number,
    keycloakUserId: string,
    firstName: string,
    lastName: string,
    document: string,
    phoneNumber: string | null,
    emergencyContactName: string | null,
    emergencyContactPhone: string | null,
    apartmentResidents: ApartmentResidentResponse[]
}

export interface ResidentProfileResponse {
    id: number,
    keycloakUserId: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    document: string,
    phoneNumber: string | null,
    emergencyContactName: string | null,
    emergencyContactPhone: string | null,
    apartmentResidents: ApartmentResidentResponse[]
}

export interface ExpenseResponse {
    id: number,
    description: string,
    amount: number,
    billed: boolean,
    scopeType: string,
    applicableTowers: Set<string>,
    createdDate: string,
    lastModifiedDate: string | null
}

export interface PaymentResponse {
    id: number,
    amount: number,
    description: string,
    reference: string | null,
    type: string,
    apartmentId: number,
    residentId: number,
    approved: boolean,
    createdDate: string
}

export interface ResidentRequest {
    id: number | null,
    keycloakUserId: string,
    document: string
    phoneNumber: string | null,
    emergencyContactName: string | null,
    emergencyContactPhone: string | null
}

export interface ApartmentRequest {
    id: number | null,
    code: string,
    tower: string
    sqm: number,
    aliquot: number
}

export interface PaymentRequest {
    id: number | null,
    amount: number,
    type: string
    reference: string | null,
    description: string,
    apartmentId: number
}

export interface ExpenseRequest {
    id: number | null,
    description: string,
    amount: number,
    scopeType: string,
    applicableTowers: Set<string>
}