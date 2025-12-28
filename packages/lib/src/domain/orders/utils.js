import { DELIVERY_STATUSES, PAYMENT_STATUSES } from "./constants";

export const filtercolumnFields = {
    cartReferenceId: 'o.cart_reference_id',
    amount: 'o.amount',
    createdAt: `o.created_at AT TIME ZONE 'Asia/Kolkata'`,
    amountPaid: 'o.amount_paid',
    customerName: 'u.name',
    mobile: 'u.mobile',
    shippingAddress: `CONCAT(u.address, ', ', u.landmark, ', ', u.pincode, '.')`,
    paymentStatus: 'o.internal_status',
    isSuspicious: 'o.is_suspicious',
    product: {
        referenceId: 'o.reference_id',
        productName: 'p.name',
        quantity: 'o.quantity',
        deliveryStatus: 'o.delivery_status',
        productPrice: 'o.price'
    }
};

export const adminFilters = [
    {
        field: 'cartReferenceId',
        type: 'text',
    },
    {
        field: 'amount',
        type: 'number',
    },
    {
        field: 'createdAt',
        type: 'range',
    },
    {
        field: 'amountPaid',
        type: 'number',
    },
    {
        field: 'customerName',
        type: 'text',
    },
    {
        field: 'mobile',
        type: 'text',
    },
    {
        field: 'shippingAddress',
        type: 'text',
    },
    {
        field: 'paymentStatus',
        type: 'select',
        options: PAYMENT_STATUSES.map(status => ({ label: status, value: status })),
    },
    {
        field: 'isSuspicious',
        type: 'boolean',
    },
    {
        field: 'productName',
        type: 'text',
    },
    {
        field: 'quantity',
        type: 'number',
    },
    {
        field: 'deliveryStatus',
        type: 'select',
        options: DELIVERY_STATUSES,
    },
    {
        field: 'productPrice',
        type: 'number',
    },
];

