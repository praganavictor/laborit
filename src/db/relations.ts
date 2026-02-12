import { relations } from 'drizzle-orm/relations'
import {
  employees,
  employeePrivileges,
  privileges,
  inventoryTransactionTypes,
  inventoryTransactions,
  orders,
  products,
  purchaseOrders,
  invoices,
  orderDetails,
  orderDetailsStatus,
  customers,
  ordersStatus,
  ordersTaxStatus,
  shippers,
  purchaseOrderDetails,
  purchaseOrderStatus,
  suppliers,
} from './schema'

export const employeePrivilegesRelations = relations(
  employeePrivileges,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeePrivileges.employeeId],
      references: [employees.id],
    }),
    privilege: one(privileges, {
      fields: [employeePrivileges.privilegeId],
      references: [privileges.id],
    }),
  }),
)

export const employeesRelations = relations(employees, ({ many }) => ({
  employeePrivileges: many(employeePrivileges),
  orders: many(orders),
  purchaseOrders: many(purchaseOrders),
}))

export const privilegesRelations = relations(privileges, ({ many }) => ({
  employeePrivileges: many(employeePrivileges),
}))

export const inventoryTransactionsRelations = relations(
  inventoryTransactions,
  ({ one, many }) => ({
    inventoryTransactionType: one(inventoryTransactionTypes, {
      fields: [inventoryTransactions.transactionType],
      references: [inventoryTransactionTypes.id],
    }),
    order: one(orders, {
      fields: [inventoryTransactions.customerOrderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [inventoryTransactions.productId],
      references: [products.id],
    }),
    purchaseOrder: one(purchaseOrders, {
      fields: [inventoryTransactions.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    purchaseOrderDetails: many(purchaseOrderDetails),
  }),
)

export const inventoryTransactionTypesRelations = relations(
  inventoryTransactionTypes,
  ({ many }) => ({
    inventoryTransactions: many(inventoryTransactions),
  }),
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  inventoryTransactions: many(inventoryTransactions),
  invoices: many(invoices),
  orderDetails: many(orderDetails),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  employee: one(employees, {
    fields: [orders.employeeId],
    references: [employees.id],
  }),
  ordersStatus: one(ordersStatus, {
    fields: [orders.statusId],
    references: [ordersStatus.id],
  }),
  ordersTaxStatus: one(ordersTaxStatus, {
    fields: [orders.taxStatusId],
    references: [ordersTaxStatus.id],
  }),
  shipper: one(shippers, {
    fields: [orders.shipperId],
    references: [shippers.id],
  }),
}))

export const productsRelations = relations(products, ({ many }) => ({
  inventoryTransactions: many(inventoryTransactions),
  orderDetails: many(orderDetails),
  purchaseOrderDetails: many(purchaseOrderDetails),
}))

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    inventoryTransactions: many(inventoryTransactions),
    purchaseOrderDetails: many(purchaseOrderDetails),
    employee: one(employees, {
      fields: [purchaseOrders.createdBy],
      references: [employees.id],
    }),
    purchaseOrderStatus: one(purchaseOrderStatus, {
      fields: [purchaseOrders.statusId],
      references: [purchaseOrderStatus.id],
    }),
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
  }),
)

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
}))

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, {
    fields: [orderDetails.orderId],
    references: [orders.id],
  }),
  orderDetailsStatus: one(orderDetailsStatus, {
    fields: [orderDetails.statusId],
    references: [orderDetailsStatus.id],
  }),
  product: one(products, {
    fields: [orderDetails.productId],
    references: [products.id],
  }),
}))

export const orderDetailsStatusRelations = relations(
  orderDetailsStatus,
  ({ many }) => ({
    orderDetails: many(orderDetails),
  }),
)

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}))

export const ordersStatusRelations = relations(ordersStatus, ({ many }) => ({
  orders: many(orders),
}))

export const ordersTaxStatusRelations = relations(
  ordersTaxStatus,
  ({ many }) => ({
    orders: many(orders),
  }),
)

export const shippersRelations = relations(shippers, ({ many }) => ({
  orders: many(orders),
}))

export const purchaseOrderDetailsRelations = relations(
  purchaseOrderDetails,
  ({ one }) => ({
    inventoryTransaction: one(inventoryTransactions, {
      fields: [purchaseOrderDetails.inventoryId],
      references: [inventoryTransactions.id],
    }),
    product: one(products, {
      fields: [purchaseOrderDetails.productId],
      references: [products.id],
    }),
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderDetails.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
  }),
)

export const purchaseOrderStatusRelations = relations(
  purchaseOrderStatus,
  ({ many }) => ({
    purchaseOrders: many(purchaseOrders),
  }),
)

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  purchaseOrders: many(purchaseOrders),
}))
