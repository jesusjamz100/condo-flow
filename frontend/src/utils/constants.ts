
export const NAVBAR_PUBLIC_ITEMS: Array<Array<string>> = [
    ["Dashboard", "/dashboard"],
    ["Apartamentos", "/dashboard/apartamentos"],
    ["Pagos", "/dashboard/pagos"],
    ["Facturas", "/dashboard/facturas"],
];

export const NAVBAR_ADMIN_ITEMS: Array<Array<string>> = [
    ["Dashboard", "/admin/dashboard"],
    ["Residentes", "/admin/dashboard/residentes"],
    ["Apartamentos", "/admin/dashboard/apartamentos"],
    ["Pagos", "/admin/dashboard/pagos"],
    ["Facturas", "/admin/dashboard/facturas"],
];

export const PAYMENT_TYPES: Array<string> = [
    "WIRE", "CASH"
];

export const TOWERS: Array<string> = [
    "A", "B", "C", "D"
];

export const SCOPE_TYPES: Array<string> = [
    "GENERAL", "TOWER", "SECTOR"
];