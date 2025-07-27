// In a real-world scenario, this data would be fetched from a backend API.

export const mockRequirements = [
    { id: 1, pincode: '110018', state: 'Delhi', item: 'Steel Rods (TMT)', quantity: 500, unit: 'kg', price: 55, status: 'open' },
    { id: 2, pincode: '110001', state: 'Delhi', item: 'Steel Rods (TMT)', quantity: 300, unit: 'kg', price: 56, status: 'open' },
    { id: 3, pincode: '110001', state: 'Delhi', item: 'Cement (OPC 53)', quantity: 100, unit: 'bags', price: 450, status: 'open' },
    { id: 4, pincode: '400001', state: 'Maharashtra', item: 'Steel Rods (TMT)', quantity: 800, unit: 'kg', price: 58, status: 'open' },
    { id: 5, pincode: '110001', state: 'Delhi', item: 'Cement (OPC 53)', quantity: 150, unit: 'bags', price: 445, status: 'closed' },
    { id: 6, pincode: '560001', state: 'Karnataka', item: 'Plywood (18mm)', quantity: 100, unit: 'sheets', price: 1200, status: 'open' },
    { id: 7, pincode: '400008', state: 'Maharashtra', item: 'PVC Pipes (4 inch)', quantity: 300, unit: 'meters', price: 80, status: 'open' },
    { id: 8, pincode: '110025', state: 'Delhi', item: 'Bricks (Class A)', quantity: 5000, unit: 'pieces', price: 8, status: 'open' }
];

export const mockBids = [
    { id: 1, requirementId: 1, supplierName: 'Shree Ram Steels', price: 52 },
    { id: 2, requirementId: 2, supplierName: 'Gupta Iron Store', price: 53 },
    { id: 3, requirementId: 3, supplierName: 'Singhania Cements', price: 435 },
    { id: 4, requirementId: 4, supplierName: 'Mumbai Metals', price: 59 },
    { id: 5, requirementId: 1, supplierName: 'Delhi Metals Co.', price: 51.50 },
];
