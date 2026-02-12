import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  index,
  primaryKey,
  int,
  varchar,
  longtext,
  foreignKey,
  tinyint,
  datetime,
  decimal,
  double,
  unique,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

export const customers = mysqlTable(
  'customers',
  {
    id: int().autoincrement().notNull(),
    company: varchar({ length: 50 }),
    lastName: varchar('last_name', { length: 50 }),
    firstName: varchar('first_name', { length: 50 }),
    emailAddress: varchar('email_address', { length: 50 }),
    jobTitle: varchar('job_title', { length: 50 }),
    businessPhone: varchar('business_phone', { length: 25 }),
    homePhone: varchar('home_phone', { length: 25 }),
    mobilePhone: varchar('mobile_phone', { length: 25 }),
    faxNumber: varchar('fax_number', { length: 25 }),
    address: longtext(),
    city: varchar({ length: 50 }),
    stateProvince: varchar('state_province', { length: 50 }),
    zipPostalCode: varchar('zip_postal_code', { length: 15 }),
    countryRegion: varchar('country_region', { length: 50 }),
    webPage: longtext('web_page'),
    notes: longtext(),
    // Warning: Can't parse longblob from database
    // longblobType: longblob("attachments"),
  },
  (table) => [
    index('city').on(table.city),
    index('company').on(table.company),
    index('first_name').on(table.firstName),
    index('last_name').on(table.lastName),
    index('zip_postal_code').on(table.zipPostalCode),
    index('state_province').on(table.stateProvince),
    primaryKey({ columns: [table.id], name: 'customers_id' }),
  ],
)

export const employeePrivileges = mysqlTable(
  'employee_privileges',
  {
    employeeId: int('employee_id')
      .notNull()
      .references(() => employees.id),
    privilegeId: int('privilege_id')
      .notNull()
      .references(() => privileges.id),
  },
  (table) => [
    index('employee_id').on(table.employeeId),
    index('privilege_id').on(table.privilegeId),
    index('privilege_id_2').on(table.privilegeId),
    primaryKey({
      columns: [table.employeeId, table.privilegeId],
      name: 'employee_privileges_employee_id_privilege_id',
    }),
  ],
)

export const employees = mysqlTable(
  'employees',
  {
    id: int().autoincrement().notNull(),
    company: varchar({ length: 50 }),
    lastName: varchar('last_name', { length: 50 }),
    firstName: varchar('first_name', { length: 50 }),
    emailAddress: varchar('email_address', { length: 50 }),
    jobTitle: varchar('job_title', { length: 50 }),
    businessPhone: varchar('business_phone', { length: 25 }),
    homePhone: varchar('home_phone', { length: 25 }),
    mobilePhone: varchar('mobile_phone', { length: 25 }),
    faxNumber: varchar('fax_number', { length: 25 }),
    address: longtext(),
    city: varchar({ length: 50 }),
    stateProvince: varchar('state_province', { length: 50 }),
    zipPostalCode: varchar('zip_postal_code', { length: 15 }),
    countryRegion: varchar('country_region', { length: 50 }),
    webPage: longtext('web_page'),
    notes: longtext(),
    // Warning: Can't parse longblob from database
    // longblobType: longblob("attachments"),
  },
  (table) => [
    index('city').on(table.city),
    index('company').on(table.company),
    index('first_name').on(table.firstName),
    index('last_name').on(table.lastName),
    index('zip_postal_code').on(table.zipPostalCode),
    index('state_province').on(table.stateProvince),
    primaryKey({ columns: [table.id], name: 'employees_id' }),
  ],
)

export const inventoryTransactionTypes = mysqlTable(
  'inventory_transaction_types',
  {
    id: tinyint().notNull(),
    typeName: varchar('type_name', { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'inventory_transaction_types_id' }),
  ],
)

export const inventoryTransactions = mysqlTable(
  'inventory_transactions',
  {
    id: int().autoincrement().notNull(),
    transactionType: tinyint('transaction_type')
      .notNull()
      .references(() => inventoryTransactionTypes.id),
    transactionCreatedDate: datetime('transaction_created_date', {
      mode: 'string',
    }),
    transactionModifiedDate: datetime('transaction_modified_date', {
      mode: 'string',
    }),
    productId: int('product_id')
      .notNull()
      .references(() => products.id),
    quantity: int().notNull(),
    purchaseOrderId: int('purchase_order_id').references(
      () => purchaseOrders.id,
    ),
    customerOrderId: int('customer_order_id').references(() => orders.id),
    comments: varchar({ length: 255 }),
  },
  (table) => [
    index('customer_order_id').on(table.customerOrderId),
    index('customer_order_id_2').on(table.customerOrderId),
    index('product_id').on(table.productId),
    index('product_id_2').on(table.productId),
    index('purchase_order_id').on(table.purchaseOrderId),
    index('purchase_order_id_2').on(table.purchaseOrderId),
    index('transaction_type').on(table.transactionType),
    primaryKey({ columns: [table.id], name: 'inventory_transactions_id' }),
  ],
)

export const invoices = mysqlTable(
  'invoices',
  {
    id: int().autoincrement().notNull(),
    orderId: int('order_id').references(() => orders.id),
    invoiceDate: datetime('invoice_date', { mode: 'string' }),
    dueDate: datetime('due_date', { mode: 'string' }),
    tax: decimal({ precision: 19, scale: 4 }).default('0.0000'),
    shipping: decimal({ precision: 19, scale: 4 }).default('0.0000'),
    amountDue: decimal('amount_due', { precision: 19, scale: 4 }).default(
      '0.0000',
    ),
  },
  (table) => [
    index('id').on(table.id),
    index('id_2').on(table.id),
    index('fk_invoices_orders1_idx').on(table.orderId),
    primaryKey({ columns: [table.id], name: 'invoices_id' }),
  ],
)

export const orderDetails = mysqlTable(
  'order_details',
  {
    id: int().autoincrement().notNull(),
    orderId: int('order_id')
      .notNull()
      .references(() => orders.id),
    productId: int('product_id').references(() => products.id),
    quantity: decimal({ precision: 18, scale: 4 }).default('0.0000').notNull(),
    unitPrice: decimal('unit_price', { precision: 19, scale: 4 }).default(
      '0.0000',
    ),
    discount: double().notNull(),
    statusId: int('status_id').references(() => orderDetailsStatus.id),
    dateAllocated: datetime('date_allocated', { mode: 'string' }),
    purchaseOrderId: int('purchase_order_id'),
    inventoryId: int('inventory_id'),
  },
  (table) => [
    index('id').on(table.id),
    index('inventory_id').on(table.inventoryId),
    index('id_2').on(table.id),
    index('id_3').on(table.id),
    index('id_4').on(table.id),
    index('product_id').on(table.productId),
    index('product_id_2').on(table.productId),
    index('purchase_order_id').on(table.purchaseOrderId),
    index('id_5').on(table.id),
    index('fk_order_details_orders1_idx').on(table.orderId),
    index('fk_order_details_order_details_status1_idx').on(table.statusId),
    primaryKey({ columns: [table.id], name: 'order_details_id' }),
  ],
)

export const orderDetailsStatus = mysqlTable(
  'order_details_status',
  {
    id: int().notNull(),
    statusName: varchar('status_name', { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'order_details_status_id' }),
  ],
)

export const orders = mysqlTable(
  'orders',
  {
    id: int().autoincrement().notNull(),
    employeeId: int('employee_id').references(() => employees.id),
    customerId: int('customer_id').references(() => customers.id),
    orderDate: datetime('order_date', { mode: 'string' }),
    shippedDate: datetime('shipped_date', { mode: 'string' }),
    shipperId: int('shipper_id').references(() => shippers.id),
    shipName: varchar('ship_name', { length: 50 }),
    shipAddress: longtext('ship_address'),
    shipCity: varchar('ship_city', { length: 50 }),
    shipStateProvince: varchar('ship_state_province', { length: 50 }),
    shipZipPostalCode: varchar('ship_zip_postal_code', { length: 50 }),
    shipCountryRegion: varchar('ship_country_region', { length: 50 }),
    shippingFee: decimal('shipping_fee', { precision: 19, scale: 4 }).default(
      '0.0000',
    ),
    taxes: decimal({ precision: 19, scale: 4 }).default('0.0000'),
    paymentType: varchar('payment_type', { length: 50 }),
    paidDate: datetime('paid_date', { mode: 'string' }),
    notes: longtext(),
    taxRate: double('tax_rate'),
    taxStatusId: tinyint('tax_status_id').references(() => ordersTaxStatus.id),
    statusId: tinyint('status_id')
      .default(0)
      .references(() => ordersStatus.id),
  },
  (table) => [
    index('customer_id').on(table.customerId),
    index('customer_id_2').on(table.customerId),
    index('employee_id').on(table.employeeId),
    index('employee_id_2').on(table.employeeId),
    index('id').on(table.id),
    index('id_2').on(table.id),
    index('shipper_id').on(table.shipperId),
    index('shipper_id_2').on(table.shipperId),
    index('id_3').on(table.id),
    index('tax_status').on(table.taxStatusId),
    index('ship_zip_postal_code').on(table.shipZipPostalCode),
    primaryKey({ columns: [table.id], name: 'orders_id' }),
  ],
)

export const ordersStatus = mysqlTable(
  'orders_status',
  {
    id: tinyint().notNull(),
    statusName: varchar('status_name', { length: 50 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'orders_status_id' })],
)

export const ordersTaxStatus = mysqlTable(
  'orders_tax_status',
  {
    id: tinyint().notNull(),
    taxStatusName: varchar('tax_status_name', { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'orders_tax_status_id' }),
  ],
)

export const privileges = mysqlTable(
  'privileges',
  {
    id: int().autoincrement().notNull(),
    privilegeName: varchar('privilege_name', { length: 50 }),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'privileges_id' })],
)

export const products = mysqlTable(
  'products',
  {
    supplierIds: longtext('supplier_ids'),
    id: int().autoincrement().notNull(),
    productCode: varchar('product_code', { length: 25 }),
    productName: varchar('product_name', { length: 50 }),
    description: longtext(),
    standardCost: decimal('standard_cost', { precision: 19, scale: 4 }).default(
      '0.0000',
    ),
    listPrice: decimal('list_price', { precision: 19, scale: 4 })
      .default('0.0000')
      .notNull(),
    reorderLevel: int('reorder_level'),
    targetLevel: int('target_level'),
    quantityPerUnit: varchar('quantity_per_unit', { length: 50 }),
    discontinued: tinyint().default(0).notNull(),
    minimumReorderQuantity: int('minimum_reorder_quantity'),
    category: varchar({ length: 50 }),
    // Warning: Can't parse longblob from database
    // longblobType: longblob("attachments"),
  },
  (table) => [
    index('product_code').on(table.productCode),
    primaryKey({ columns: [table.id], name: 'products_id' }),
  ],
)

export const purchaseOrderDetails = mysqlTable(
  'purchase_order_details',
  {
    id: int().autoincrement().notNull(),
    purchaseOrderId: int('purchase_order_id')
      .notNull()
      .references(() => purchaseOrders.id),
    productId: int('product_id').references(() => products.id),
    quantity: decimal({ precision: 18, scale: 4 }).notNull(),
    unitCost: decimal('unit_cost', { precision: 19, scale: 4 }).notNull(),
    dateReceived: datetime('date_received', { mode: 'string' }),
    postedToInventory: tinyint('posted_to_inventory').default(0).notNull(),
    inventoryId: int('inventory_id').references(() => inventoryTransactions.id),
  },
  (table) => [
    index('id').on(table.id),
    index('inventory_id').on(table.inventoryId),
    index('inventory_id_2').on(table.inventoryId),
    index('purchase_order_id').on(table.purchaseOrderId),
    index('product_id').on(table.productId),
    index('product_id_2').on(table.productId),
    index('purchase_order_id_2').on(table.purchaseOrderId),
    primaryKey({ columns: [table.id], name: 'purchase_order_details_id' }),
  ],
)

export const purchaseOrderStatus = mysqlTable(
  'purchase_order_status',
  {
    id: int().notNull(),
    status: varchar({ length: 50 }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'purchase_order_status_id' }),
  ],
)

export const purchaseOrders = mysqlTable(
  'purchase_orders',
  {
    id: int().autoincrement().notNull(),
    supplierId: int('supplier_id').references(() => suppliers.id),
    createdBy: int('created_by').references(() => employees.id),
    submittedDate: datetime('submitted_date', { mode: 'string' }),
    creationDate: datetime('creation_date', { mode: 'string' }),
    statusId: int('status_id')
      .default(0)
      .references(() => purchaseOrderStatus.id),
    expectedDate: datetime('expected_date', { mode: 'string' }),
    shippingFee: decimal('shipping_fee', { precision: 19, scale: 4 })
      .default('0.0000')
      .notNull(),
    taxes: decimal({ precision: 19, scale: 4 }).default('0.0000').notNull(),
    paymentDate: datetime('payment_date', { mode: 'string' }),
    paymentAmount: decimal('payment_amount', {
      precision: 19,
      scale: 4,
    }).default('0.0000'),
    paymentMethod: varchar('payment_method', { length: 50 }),
    notes: longtext(),
    approvedBy: int('approved_by'),
    approvedDate: datetime('approved_date', { mode: 'string' }),
    submittedBy: int('submitted_by'),
  },
  (table) => [
    index('created_by').on(table.createdBy),
    index('status_id').on(table.statusId),
    index('id_2').on(table.id),
    index('supplier_id').on(table.supplierId),
    index('supplier_id_2').on(table.supplierId),
    primaryKey({ columns: [table.id], name: 'purchase_orders_id' }),
    unique('id').on(table.id),
  ],
)

export const salesReports = mysqlTable(
  'sales_reports',
  {
    groupBy: varchar('group_by', { length: 50 }).notNull(),
    display: varchar({ length: 50 }),
    title: varchar({ length: 50 }),
    filterRowSource: longtext('filter_row_source'),
    default: tinyint().default(0).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.groupBy], name: 'sales_reports_group_by' }),
  ],
)

export const shippers = mysqlTable(
  'shippers',
  {
    id: int().autoincrement().notNull(),
    company: varchar({ length: 50 }),
    lastName: varchar('last_name', { length: 50 }),
    firstName: varchar('first_name', { length: 50 }),
    emailAddress: varchar('email_address', { length: 50 }),
    jobTitle: varchar('job_title', { length: 50 }),
    businessPhone: varchar('business_phone', { length: 25 }),
    homePhone: varchar('home_phone', { length: 25 }),
    mobilePhone: varchar('mobile_phone', { length: 25 }),
    faxNumber: varchar('fax_number', { length: 25 }),
    address: longtext(),
    city: varchar({ length: 50 }),
    stateProvince: varchar('state_province', { length: 50 }),
    zipPostalCode: varchar('zip_postal_code', { length: 15 }),
    countryRegion: varchar('country_region', { length: 50 }),
    webPage: longtext('web_page'),
    notes: longtext(),
    // Warning: Can't parse longblob from database
    // longblobType: longblob("attachments"),
  },
  (table) => [
    index('city').on(table.city),
    index('company').on(table.company),
    index('first_name').on(table.firstName),
    index('last_name').on(table.lastName),
    index('zip_postal_code').on(table.zipPostalCode),
    index('state_province').on(table.stateProvince),
    primaryKey({ columns: [table.id], name: 'shippers_id' }),
  ],
)

export const strings = mysqlTable(
  'strings',
  {
    stringId: int('string_id').autoincrement().notNull(),
    stringData: varchar('string_data', { length: 255 }),
  },
  (table) => [
    primaryKey({ columns: [table.stringId], name: 'strings_string_id' }),
  ],
)

export const suppliers = mysqlTable(
  'suppliers',
  {
    id: int().autoincrement().notNull(),
    company: varchar({ length: 50 }),
    lastName: varchar('last_name', { length: 50 }),
    firstName: varchar('first_name', { length: 50 }),
    emailAddress: varchar('email_address', { length: 50 }),
    jobTitle: varchar('job_title', { length: 50 }),
    businessPhone: varchar('business_phone', { length: 25 }),
    homePhone: varchar('home_phone', { length: 25 }),
    mobilePhone: varchar('mobile_phone', { length: 25 }),
    faxNumber: varchar('fax_number', { length: 25 }),
    address: longtext(),
    city: varchar({ length: 50 }),
    stateProvince: varchar('state_province', { length: 50 }),
    zipPostalCode: varchar('zip_postal_code', { length: 15 }),
    countryRegion: varchar('country_region', { length: 50 }),
    webPage: longtext('web_page'),
    notes: longtext(),
    // Warning: Can't parse longblob from database
    // longblobType: longblob("attachments"),
  },
  (table) => [
    index('city').on(table.city),
    index('company').on(table.company),
    index('first_name').on(table.firstName),
    index('last_name').on(table.lastName),
    index('zip_postal_code').on(table.zipPostalCode),
    index('state_province').on(table.stateProvince),
    primaryKey({ columns: [table.id], name: 'suppliers_id' }),
  ],
)
