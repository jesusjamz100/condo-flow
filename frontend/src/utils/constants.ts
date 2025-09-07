
export const NAVBAR_PUBLIC_ITEMS: Array<Array<string>> = [
    ["Panel", "/dashboard"],
    ["Apartamentos", "/dashboard/apartamentos"],
    ["Pagos", "/dashboard/pagos"],
    ["Facturas", "/dashboard/facturas"],
];

export const NAVBAR_ADMIN_ITEMS: Array<Array<string>> = [
    ["Panel", "/admin/dashboard"],
    // ["Residentes", "/admin/dashboard/residentes"],
    ["Apartamentos", "/admin/dashboard/apartamentos"],
    ["Pagos", "/admin/dashboard/pagos"],
    ["Gastos", "/admin/dashboard/gastos"],
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